package com.gui;

import com.gui.services.HelloWorldService;

public class Main {
    public static void main(String[] args) {
        HelloWorldService helloWorldService = new HelloWorldService();
        System.out.println(helloWorldService.speak());
    }
}