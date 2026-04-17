package com.gui.teamScheduling.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ScheduleEntryRequest {
    private String employeeId;
    private LocalDate date;
    private String workMode; // "OFFICE", "REMOTE", "LEAVE"
}