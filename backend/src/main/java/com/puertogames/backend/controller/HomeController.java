package main.java.com.puertogames.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        return "¡Backend de PuertoGames funcionando correctamente! 🎮";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}