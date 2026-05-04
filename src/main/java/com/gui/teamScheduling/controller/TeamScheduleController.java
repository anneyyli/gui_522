package com.gui.teamScheduling.controller;

import com.gui.teamScheduling.dto.ScheduleEntryRequest;
import com.gui.teamScheduling.dto.ScheduleEntryResponse;
import com.gui.teamScheduling.dto.TeamWeekResponse;
import com.gui.teamScheduling.service.TeamScheduleService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/team-scheduling")
public class TeamScheduleController {

    private final TeamScheduleService service;

    public TeamScheduleController(TeamScheduleService service) {
        this.service = service;
    }

    @PostMapping("/schedule")
    public ScheduleEntryResponse setSchedule(@RequestBody ScheduleEntryRequest request) {
        return service.setSchedule(request);
    }

    @GetMapping("/schedule")
    public List<ScheduleEntryResponse> getScheduleForDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getScheduleForDate(date);
    }

    @GetMapping("/schedule/employee/{employeeId}")
    public List<ScheduleEntryResponse> getEmployeeSchedule(@PathVariable String employeeId) {
        return service.getEmployeeSchedule(employeeId);
    }

    @GetMapping("/schedule/week")
    public List<TeamWeekResponse> getTeamWeek(
            @RequestParam("weekStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return service.getTeamWeek(weekStart);
    }
}
