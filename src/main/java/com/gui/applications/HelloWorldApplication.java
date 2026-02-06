package com.gui.applications;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.gui")
public class HelloWorldApplication {
    public static void main(String... args) {
        SpringApplication.run(HelloWorldApplication.class, args);
    }
}
