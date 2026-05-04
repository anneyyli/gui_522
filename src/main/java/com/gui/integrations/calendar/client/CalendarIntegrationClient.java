package com.gui.integrations.calendar.client;

import com.gui.integrations.calendar.dto.CalendarEventDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class CalendarIntegrationClient {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    public List<CalendarEventDto> getEvents() {
        try {
            return mapper.readValue(new File("calendar-events.json"), new TypeReference<>() {});
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
