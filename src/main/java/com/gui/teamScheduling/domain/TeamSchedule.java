package com.gui.teamScheduling.domain;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class TeamSchedule {
    private String id;
    private String employeeId;
    private LocalDate date;
    private WorkMode workMode;
    private String officeLocation;

    public enum WorkMode { OFFICE, REMOTE, LEAVE }
}