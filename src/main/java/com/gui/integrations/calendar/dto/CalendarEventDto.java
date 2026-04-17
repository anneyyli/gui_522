package com.gui.integrations.calendar.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CalendarEventDto {
    private String id;
    private String title;
    private LocalDate date;
    private String employeeId;
    private String type; // "OFFICE_DAY", "REMOTE", "LEAVE"
}