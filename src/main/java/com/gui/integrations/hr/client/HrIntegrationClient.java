package com.gui.integrations.hr.client;

import com.gui.integrations.hr.dto.EmployeeDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class HrIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper();

    public List<EmployeeDto> getAllEmployees() {
        try {
            return mapper.readValue(new File("employees.json"), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse HR data", e);
        }
    }

    public EmployeeDto getEmployeeById(String id) {
        return getAllEmployees().stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
    }
}
