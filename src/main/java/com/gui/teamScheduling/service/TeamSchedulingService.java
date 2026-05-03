package com.gui.teamScheduling.service;

import com.gui.integrations.hr.client.HrIntegrationClient;
import com.gui.teamScheduling.domain.TeamSchedule;
import com.gui.teamScheduling.dto.*;
import com.gui.teamScheduling.mapper.TeamScheduleMapper;
import com.gui.teamScheduling.repository.TeamScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamSchedulingService {

    private final TeamScheduleRepository repository;
    private final HrIntegrationClient hrClient;
    private final TeamScheduleMapper mapper;

    public ScheduleEntryResponse setScheduleEntry(ScheduleEntryRequest request) {
        TeamSchedule schedule = new TeamSchedule();
        schedule.setId(UUID.randomUUID().toString());
        schedule.setEmployeeId(request.getEmployeeId());
        schedule.setDate(request.getDate());
        schedule.setWorkMode(TeamSchedule.WorkMode.valueOf(request.getWorkMode()));
        repository.save(schedule);

        var employee = hrClient.getEmployeeById(request.getEmployeeId());
        return mapper.toResponse(schedule, employee);
    }

    public List<ScheduleEntryResponse> getScheduleForDate(LocalDate date) {
        return repository.findByDate(date).stream()
                .map(s -> mapper.toResponse(s, hrClient.getEmployeeById(s.getEmployeeId())))
                .toList();
    }

    public List<TeamWeekResponse> getTeamWeek(LocalDate weekStart) {
        LocalDate weekEnd = weekStart.plusDays(4);
        List<TeamSchedule> entries = repository.findByDateBetween(weekStart, weekEnd);

        Map<String, List<ScheduleEntryResponse>> byDepartment = new HashMap<>();
        for (TeamSchedule s : entries) {
            var employee = hrClient.getEmployeeById(s.getEmployeeId());
            String dept = employee != null ? employee.getDepartment() : "Unknown";
            byDepartment.computeIfAbsent(dept, k -> new ArrayList<>())
                    .add(mapper.toResponse(s, employee));
        }

        return byDepartment.entrySet().stream().map(e -> {
            TeamWeekResponse r = new TeamWeekResponse();
            r.setDepartment(e.getKey());
            r.setEntries(e.getValue());
            return r;
        }).toList();
    }

    public List<ScheduleEntryResponse> getScheduleForEmployee(String employeeId) {
        var employee = hrClient.getEmployeeById(employeeId);
        return repository.findByEmployeeId(employeeId).stream()
                .map(s -> mapper.toResponse(s, employee))
                .toList();
    }
}