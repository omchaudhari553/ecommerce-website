package com.springboot.service;

import com.springboot.dto.PaymentRequest;
import com.springboot.dto.PaymentResponse;
import com.springboot.entity.Order;
import com.springboot.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.company.name:Cara}")
    private String companyName;

    @Value("${razorpay.test.mode:false}")
    private boolean testMode;

    public PaymentResponse createPaymentOrder(PaymentRequest request) {
        try {
            logger.info("Creating payment order for orderId: {}, amount: {}", request.getOrderId(), request.getAmount());

            // Validate order exists
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + request.getOrderId()));

            // Convert amount to paise (Razorpay expects amount in smallest currency unit)
            BigDecimal amountInRupees = request.getAmount();
            BigDecimal amountInPaise = amountInRupees.multiply(new BigDecimal("100"));
            
            logger.info("Amount in rupees: {}, Amount in paise: {}", amountInRupees, amountInPaise);

            // Create Razorpay order
            JSONObject razorpayOrderRequest = new JSONObject();
            razorpayOrderRequest.put("amount", amountInPaise.intValue());
            razorpayOrderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            razorpayOrderRequest.put("receipt", request.getReceipt());
            razorpayOrderRequest.put("notes", new JSONObject()
                    .put("orderId", request.getOrderId().toString())
                    .put("companyName", companyName));
            
            // Add payment method restrictions to ensure Indian cards work
            JSONObject notes = new JSONObject();
            notes.put("orderId", request.getOrderId().toString());
            notes.put("companyName", companyName);
            notes.put("payment_method_types", new JSONArray().put("card").put("upi").put("netbanking"));
            razorpayOrderRequest.put("notes", notes);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(razorpayOrderRequest);
            
            logger.info("Razorpay order created successfully: {}", razorpayOrder.toString());

            // Create response
            PaymentResponse response = new PaymentResponse();
            response.setRazorpayOrderId(razorpayOrder.get("id"));
            response.setAmount(String.valueOf(amountInPaise.intValue())); // Return amount in paise
            response.setKey(keyId);
            response.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
            response.setDescription("Order #" + request.getOrderId() + " - " + companyName);

            logger.info("Payment response created: {}", response);
            return response;

        } catch (RazorpayException e) {
            logger.error("Razorpay error while creating payment order: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error while creating payment order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }
    }

    public boolean verifyPayment(String orderId, String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        try {
            logger.info("Verifying payment - orderId: {}, razorpayPaymentId: {}, razorpayOrderId: {}", 
                       orderId, razorpayPaymentId, razorpayOrderId);

            // Find order first
            Order order = orderRepository.findById(Long.parseLong(orderId))
                    .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
            
            logger.info("Found order: {} for verification", order.getId());

            boolean isValid;
            String expectedSignature = null;
            
            // In test mode, bypass signature verification
            if (testMode) {
                logger.info("TEST MODE: Bypassing signature verification");
                isValid = true;
            } else {
                // Generate signature
                String data = razorpayOrderId + "|" + razorpayPaymentId;
                expectedSignature = generateSignature(data, keySecret);

                logger.info("Signature verification details:");
                logger.info("  Data: {}", data);
                logger.info("  Expected signature: {}", expectedSignature);
                logger.info("  Received signature: {}", razorpaySignature);
                logger.info("  Key secret: {}", keySecret.substring(0, 8) + "...");

                isValid = expectedSignature.equals(razorpaySignature);
            }
            
            if (isValid) {
                logger.info("Payment signature verification successful");
                
                // Update order status
                order.setRazorpayOrderId(razorpayOrderId);
                order.setRazorpayPaymentId(razorpayPaymentId);
                order.setRazorpaySignature(razorpaySignature);
                order.setPaymentStatus("COMPLETED");
                order.setStatus("PROCESSING");
                
                orderRepository.save(order);
                logger.info("Payment verified and order updated successfully for orderId: {}", orderId);
            } else {
                logger.error("Payment signature verification failed for orderId: {}", orderId);
                logger.error("Signature mismatch - expected: {}, got: {}", expectedSignature != null ? expectedSignature : "N/A", razorpaySignature);
            }

            return isValid;

        } catch (NumberFormatException e) {
            logger.error("Invalid order ID format: {}", orderId, e);
            throw new IllegalArgumentException("Invalid order ID format: " + orderId);
        } catch (IllegalArgumentException e) {
            logger.error("Order verification failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error during payment verification: {}", e.getMessage(), e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    private String generateSignature(String data, String keySecret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] signatureBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(signatureBytes);
        } catch (Exception e) {
            logger.error("Error generating signature: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate signature: " + e.getMessage());
        }
    }
}
