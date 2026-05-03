package com.gui.dashboard.dto;

import java.util.List;

public class WeeklyScheduleRowResponse {
    private String name;
    private String role;
    private List<String> days;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<String> getDays() { return days; }
    public void setDays(List<String> days) { this.days = days; }
}
