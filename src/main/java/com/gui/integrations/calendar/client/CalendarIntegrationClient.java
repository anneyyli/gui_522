package com.gui.integrations.calendar.client;

import com.gui.integrations.calendar.dto.CalendarEventDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CalendarIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private static final String HARDCODED_JSON = """
        [
          {"id":"C001","title":"Office Day","date":"2026-04-21","employeeId":"E001","type":"OFFICE_DAY"},
          {"id":"C002","title":"Remote Work","date":"2026-04-21","employeeId":"E002","type":"REMOTE"},
          {"id":"C003","title":"Office Day","date":"2026-04-22","employeeId":"E003","type":"OFFICE_DAY"},
          {"id":"C004","title":"Annual Leave","date":"2026-04-22","employeeId":"E004","type":"LEAVE"},
          {"id":"C005","title":"Office Day","date":"2026-04-23","employeeId":"E001","type":"OFFICE_DAY"}
        ]
        """;

    public List<CalendarEventDto> getEvents() {
        try {
            return mapper.readValue(HARDCODED_JSON, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse calendar data", e);
        }
    }

    public List<CalendarEventDto> getEventsForEmployee(String employeeId) {
        return getEvents().stream()
                .filter(e -> e.getEmployeeId().equals(employeeId))
                .toList();
    }
}