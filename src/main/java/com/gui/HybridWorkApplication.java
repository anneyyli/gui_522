package com.gui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.gui")
public class HybridWorkApplication {
    public static void main(String[] args) {
        SpringApplication.run(HybridWorkApplication.class, args);
    }
}