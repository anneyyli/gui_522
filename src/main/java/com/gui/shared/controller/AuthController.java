package com.gui.shared.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            // Read users from JSON file
            File usersFile = new File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Find user by employeeId and password
            Optional<Map<String, Object>> userOpt = users.stream()
                .filter(user -> request.employeeId.equals(user.get("employeeId")) &&
                               request.password.equals(user.get("password")))
                .findFirst();

            if (userOpt.isPresent()) {
                Map<String, Object> user = userOpt.get();

                // Authenticate with Spring Security
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.employeeId, request.password)
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Store in session
                HttpSession session = httpRequest.getSession(true);
                session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());

                return ResponseEntity.ok(Map.of(
                    "employeeId", user.get("employeeId"),
                    "name", user.get("name"),
                    "email", user.get("email"),
                    "role", user.get("role")
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Server error"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            try {
                // Get user details from JSON
                File usersFile = new File("users.json");
                List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

                Map<String, Object> user = users.stream()
                    .filter(u -> auth.getName().equals(u.get("employeeId")))
                    .findFirst()
                    .orElse(null);

                if (user != null) {
                    return ResponseEntity.ok(Map.of(
                        "employeeId", user.get("employeeId"),
                        "name", user.get("name"),
                        "email", user.get("email"),
                        "role", user.get("role")
                    ));
                }
            } catch (Exception e) {
                // Ignore and return basic info
            }
            // Fallback
            return ResponseEntity.ok(Map.of(
                "employeeId", auth.getName(),
                "name", "User",
                "email", auth.getName() + "@company.com"
            ));
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    public static class LoginRequest {
        public String employeeId;
        public String password;
    }
}