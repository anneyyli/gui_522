package com.gui.teamScheduling.controller;

import com.gui.teamScheduling.dto.*;
import com.gui.teamScheduling.service.TeamSchedulingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/team-scheduling")
@RequiredArgsConstructor
public class TeamSchedulingController {

    private final TeamSchedulingService service;

    public TeamSchedulingController(TeamSchedulingService service) {
        this.service = service;
    }

    @PostMapping("/schedule")
    public ResponseEntity<ScheduleEntryResponse> setSchedule(@RequestBody ScheduleEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.setScheduleEntry(request));
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<ScheduleEntryResponse>> getScheduleForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getScheduleForDate(date));
    }

    @GetMapping("/schedule/week")
    public ResponseEntity<List<TeamWeekResponse>> getTeamWeek(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(service.getTeamWeek(weekStart));
    }

    @GetMapping("/schedule/employee/{employeeId}")
    public ResponseEntity<List<ScheduleEntryResponse>> getEmployeeSchedule(@PathVariable String employeeId) {
        return ResponseEntity.ok(service.getScheduleForEmployee(employeeId));
    }
}