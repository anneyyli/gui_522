package com.gui.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;

@Service
public class JsonUserDetailsService implements UserDetailsService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public UserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {
        try {
            File usersFile = new File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            Map<String, Object> user = users.stream()
                .filter(u -> employeeId.equals(u.get("employeeId")))
                .findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + employeeId));

            return User.builder()
                .username((String) user.get("employeeId"))
                .password((String) user.get("password"))
                .roles("USER")
                .build();
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found: " + employeeId, e);
        }
    }
}