package com.gui.teamScheduling.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class TeamWeekResponse {
    private String department;
    private List<ScheduleEntryResponse> entries;
}