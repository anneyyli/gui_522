package com.gui.integrations.office.client;

import com.gui.integrations.office.dto.DeskDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OfficeIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper();

    private static final String HARDCODED_JSON = """
        [
          {"id":"D001","label":"Desk 1A","floor":"1","zone":"Open Plan","hasMonitor":true,"hasStandingOption":false},
          {"id":"D002","label":"Desk 1B","floor":"1","zone":"Open Plan","hasMonitor":true,"hasStandingOption":true},
          {"id":"D003","label":"Desk 2A","floor":"2","zone":"Quiet Zone","hasMonitor":false,"hasStandingOption":false},
          {"id":"D004","label":"Desk 2B","floor":"2","zone":"Quiet Zone","hasMonitor":true,"hasStandingOption":false},
          {"id":"D005","label":"Desk 3A","floor":"3","zone":"Collaboration","hasMonitor":true,"hasStandingOption":true}
        ]
        """;

    public List<DeskDto> getAllDesks() {
        try {
            return mapper.readValue(HARDCODED_JSON, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse office data", e);
        }
    }
}