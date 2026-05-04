package com.gui.teamScheduling.service;

import com.gui.integrations.hr.client.HrIntegrationClient;
import com.gui.integrations.hr.dto.EmployeeDto;
import com.gui.teamScheduling.domain.TeamSchedule;
import com.gui.teamScheduling.dto.ScheduleEntryRequest;
import com.gui.teamScheduling.dto.ScheduleEntryResponse;
import com.gui.teamScheduling.dto.TeamWeekResponse;
import com.gui.teamScheduling.mapper.TeamScheduleMapper;
import com.gui.teamScheduling.repository.TeamScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Manages employee work-mode schedules (OFFICE, REMOTE, LEAVE) for each weekday.
 * This data feeds both the "Update Status" page (personal) and the manager's
 * Direct Reports Gantt chart. Schedules are per-day and per-employee, allowing
 * flexible hybrid patterns that the design spec identified as a core requirement.
 */
@Service
public class TeamScheduleService {

    private final TeamScheduleRepository repository;
    private final HrIntegrationClient hrClient;
    private final TeamScheduleMapper mapper;

    public TeamScheduleService(TeamScheduleRepository repository, HrIntegrationClient hrClient, TeamScheduleMapper mapper) {
        this.repository = repository;
        this.hrClient = hrClient;
        this.mapper = mapper;
    }

    public ScheduleEntryResponse setSchedule(ScheduleEntryRequest request) {
        List<TeamSchedule> existing = repository.findByEmployeeId(request.getEmployeeId()).stream()
                .filter(s -> s.getDate().equals(request.getDate()))
                .toList();

        TeamSchedule schedule;
        if (!existing.isEmpty()) {
            schedule = existing.get(0);
        } else {
            schedule = new TeamSchedule();
            schedule.setId(UUID.randomUUID().toString());
            schedule.setEmployeeId(request.getEmployeeId());
            schedule.setDate(request.getDate());
        }

        schedule.setWorkMode(TeamSchedule.WorkMode.valueOf(request.getWorkMode()));
        repository.save(schedule);

        EmployeeDto employee = hrClient.getEmployeeById(request.getEmployeeId());
        return mapper.toResponse(schedule, employee);
    }

    public List<ScheduleEntryResponse> getScheduleForDate(LocalDate date) {
        return repository.findByDate(date).stream()
                .map(s -> mapper.toResponse(s, hrClient.getEmployeeById(s.getEmployeeId())))
                .toList();
    }

    public List<ScheduleEntryResponse> getEmployeeSchedule(String employeeId) {
        return repository.findByEmployeeId(employeeId).stream()
                .map(s -> mapper.toResponse(s, hrClient.getEmployeeById(s.getEmployeeId())))
                .toList();
    }

    public List<TeamWeekResponse> getTeamWeek(LocalDate weekStart) {
        LocalDate weekEnd = weekStart.plusDays(4);
        List<TeamSchedule> entries = repository.findByDateBetween(weekStart, weekEnd);

        Map<String, List<TeamSchedule>> byDepartment = entries.stream()
                .collect(Collectors.groupingBy(s -> {
                    try {
                        return hrClient.getEmployeeById(s.getEmployeeId()).getDepartment();
                    } catch (Exception e) {
                        return "Unknown";
                    }
                }));

        return byDepartment.entrySet().stream().map(entry -> {
            TeamWeekResponse resp = new TeamWeekResponse();
            resp.setDepartment(entry.getKey());
            resp.setEntries(entry.getValue().stream()
                    .map(s -> mapper.toResponse(s, hrClient.getEmployeeById(s.getEmployeeId())))
                    .toList());
            return resp;
        }).toList();
    }
}
