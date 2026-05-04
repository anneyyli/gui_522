package com.gui.integrations.office.client;

import com.gui.integrations.office.dto.DeskDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class OfficeIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper();

    public List<DeskDto> getAllDesks() {
        try {
            return mapper.readValue(new File("desks.json"), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse office data", e);
        }
    }
}
