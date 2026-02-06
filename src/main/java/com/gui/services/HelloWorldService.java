package com.gui.services;

import org.springframework.stereotype.Service;

@Service
public class HelloWorldService {
    public String speak() {
        return "Hello World!";
    }
}
