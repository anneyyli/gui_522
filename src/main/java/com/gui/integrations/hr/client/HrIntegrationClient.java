package com.gui.integrations.hr.client;

import com.gui.integrations.hr.dto.EmployeeDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HrIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper();

    private static final String HARDCODED_JSON = """
        [
          {"id":"E001","name":"Alice Johnson","email":"alice@company.com","department":"Engineering","role":"Software Engineer"},
          {"id":"E002","name":"Bob Smith","email":"bob@company.com","department":"Design","role":"UX Designer"},
          {"id":"E003","name":"Carol White","email":"carol@company.com","department":"Engineering","role":"Tech Lead"},
          {"id":"E004","name":"Dan Brown","email":"dan@company.com","department":"Product","role":"Product Manager"},
          {"id":"E005","name":"Eve Davis","email":"eve@company.com","department":"Engineering","role":"QA Engineer"}
        ]
        """;

    public List<EmployeeDto> getAllEmployees() {
        try {
            return mapper.readValue(HARDCODED_JSON, new TypeReference<>() {});
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