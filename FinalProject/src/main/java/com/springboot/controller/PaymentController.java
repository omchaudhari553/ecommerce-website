package com.springboot.controller;

import com.springboot.dto.PaymentRequest;
import com.springboot.dto.PaymentResponse;
import com.springboot.entity.Order;
import com.springboot.repository.OrderRepository;
import com.springboot.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://shopping-platform.us-east-2.elasticbeanstalk.com", "http://localhost:4200"})
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        logger.info("Payment controller test endpoint called");
        Map<String, String> response = new HashMap<>();
        response.put("message", "PaymentController is working!");
        response.put("razorpayKeyId", razorpayKeyId != null ? razorpayKeyId.substring(0, 8) + "..." : "Not configured");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPaymentOrder(@RequestBody Map<String, Object> request) {
        logger.info("Received payment order creation request: {}", request);

        try {
            // Extract and validate request parameters
            if (!request.containsKey("orderId") || !request.containsKey("amount")) {
                throw new IllegalArgumentException("Missing required parameters: orderId and amount");
            }

            Long orderId = Long.valueOf(request.get("orderId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String currency = request.containsKey("currency") ? request.get("currency").toString() : "INR";
            String receipt = request.containsKey("receipt") ? request.get("receipt").toString() : "RCPT-" + orderId;

            // Validate amount
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0");
            }

            // Create payment request
            PaymentRequest paymentRequest = new PaymentRequest();
            paymentRequest.setOrderId(orderId);
            paymentRequest.setAmount(amount);
            paymentRequest.setCurrency(currency);
            paymentRequest.setReceipt(receipt);

            logger.info("Creating payment order with request: orderId={}, amount={}, currency={}", 
                       orderId, amount, currency);

            // Create payment order
            PaymentResponse response = paymentService.createPaymentOrder(paymentRequest);
            
            logger.info("Payment order created successfully: razorpayOrderId={}", response.getRazorpayOrderId());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid request for payment order creation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error creating payment order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-debug")
    public ResponseEntity<Map<String, Object>> verifyPaymentDebug(@RequestBody Map<String, String> request) {
        logger.info("Received payment verification DEBUG request: {}", request);

        try {
            // Extract parameters
            String orderId = request.get("orderId");
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String razorpayOrderId = request.get("razorpayOrderId");
            String razorpaySignature = request.get("razorpaySignature");

            logger.info("DEBUG: Bypassing verification for orderId: {}", orderId);

            // Update order status in database
            if (orderId != null) {
                try {
                    Order order = orderRepository.findById(Long.parseLong(orderId))
                            .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
                    
                    order.setRazorpayOrderId(razorpayOrderId);
                    order.setRazorpayPaymentId(razorpayPaymentId);
                    order.setRazorpaySignature(razorpaySignature);
                    order.setPaymentStatus("COMPLETED");
                    order.setStatus("PROCESSING");
                    
                    orderRepository.save(order);
                    logger.info("DEBUG: Order updated successfully in database for orderId: {}", orderId);
                } catch (Exception e) {
                    logger.error("DEBUG: Error updating order in database: {}", e.getMessage());
                }
            }

            // For debug mode, always return success
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment verification successful (DEBUG MODE)");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("DEBUG: Error in payment verification: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "DEBUG: Payment verification failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> request) {
        logger.info("Received payment verification request: {}", request);

        try {
            // Extract and validate request parameters
            String orderId = request.get("orderId");
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String razorpayOrderId = request.get("razorpayOrderId");
            String razorpaySignature = request.get("razorpaySignature");

            if (orderId == null || razorpayPaymentId == null || razorpayOrderId == null || razorpaySignature == null) {
                throw new IllegalArgumentException("Missing required parameters for payment verification");
            }

            logger.info("Verifying payment: orderId={}, razorpayPaymentId={}, razorpayOrderId={}", 
                       orderId, razorpayPaymentId, razorpayOrderId);

            // Verify payment
            boolean isValid = paymentService.verifyPayment(orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature);

            Map<String, Object> response = new HashMap<>();
            response.put("success", isValid);
            response.put("message", isValid ? "Payment verified successfully" : "Payment verification failed");

            if (isValid) {
                logger.info("Payment verification successful for orderId: {}", orderId);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Payment verification failed for orderId: {}", orderId);
                return ResponseEntity.badRequest().body(response);
            }

        } catch (IllegalArgumentException e) {
            logger.error("Invalid request for payment verification: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Error verifying payment: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Payment verification failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
