package com.gui.teamScheduling.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ScheduleEntryResponse {
    private String id;
    private String employeeId;
    private String employeeName;
    private String department;
    private LocalDate date;
    private String workMode;
}