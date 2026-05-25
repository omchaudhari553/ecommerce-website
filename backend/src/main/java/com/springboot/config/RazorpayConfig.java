package com.springboot.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@ConditionalOnExpression("!'${razorpay.key.id:}'.trim().isEmpty()")
public class RazorpayConfig {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayConfig.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        if (keyId == null || keyId.trim().isEmpty()) {
            logger.error("Razorpay Key ID is not configured!");
            throw new IllegalStateException("Razorpay Key ID must be configured in application.properties");
        }

        if (keySecret == null || keySecret.trim().isEmpty()) {
            logger.error("Razorpay Key Secret is not configured!");
            throw new IllegalStateException("Razorpay Key Secret must be configured in application.properties");
        }

        logger.info("Initializing RazorpayClient with keyId: {}", keyId);
        try {
            return new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            logger.error("Failed to initialize RazorpayClient: {}", e.getMessage());
            throw e;
        }
    }
}
