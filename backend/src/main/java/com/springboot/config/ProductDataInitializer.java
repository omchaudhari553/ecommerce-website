package com.springboot.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class ProductDataInitializer implements ApplicationRunner {

    private final ProductCatalogSeeder catalogSeeder;

    public ProductDataInitializer(ProductCatalogSeeder catalogSeeder) {
        this.catalogSeeder = catalogSeeder;
    }

    @Override
    public void run(ApplicationArguments args) {
        catalogSeeder.ensureCatalog();
    }
}
