package com.gui.controllers;

import com.gui.services.HelloWorldService;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping(value = "/apis")
@CrossOrigin(origins = "http://localhost:3000")
public class HelloWorldController {
    private final HelloWorldService helloWorldService;

    public HelloWorldController(HelloWorldService helloWorldService) {
        this.helloWorldService = helloWorldService;
    }

    @GetMapping("/helloWorld")
    public String helloWorld() {
        return helloWorldService.speak();
    }

    @GetMapping("/hello/{name}")
    public String hello(@PathVariable String name) {
        return "Hello " + name + "!";
    }
}
