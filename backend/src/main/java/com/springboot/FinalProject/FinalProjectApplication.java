package com.springboot.FinalProject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
@ComponentScan(basePackages = {"com.springboot"})
@EntityScan("com.springboot.entity")
@EnableJpaRepositories("com.springboot.repository")
public class FinalProjectApplication {
    private static final Logger logger = LoggerFactory.getLogger(FinalProjectApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(FinalProjectApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        logger.info("==========================================================");
        logger.info("Application is now ready! Access it at http://localhost:8080");
        logger.info("Available endpoints:");
        logger.info("POST   /api/orders         - Create new order");
        logger.info("GET    /api/orders/{id}    - Get order by ID");
        logger.info("GET    /api/orders/user/{email} - Get user orders");
        logger.info("==========================================================");
    }
}
