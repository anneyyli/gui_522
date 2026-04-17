package com.gui.teamScheduling.mapper;

import com.gui.integrations.hr.dto.EmployeeDto;
import com.gui.teamScheduling.domain.TeamSchedule;
import com.gui.teamScheduling.dto.ScheduleEntryResponse;
import org.springframework.stereotype.Component;

@Component
public class TeamScheduleMapper {

    public ScheduleEntryResponse toResponse(TeamSchedule schedule, EmployeeDto employee) {
        ScheduleEntryResponse r = new ScheduleEntryResponse();
        r.setId(schedule.getId());
        r.setEmployeeId(schedule.getEmployeeId());
        r.setEmployeeName(employee != null ? employee.getName() : schedule.getEmployeeId());
        r.setDepartment(employee != null ? employee.getDepartment() : "Unknown");
        r.setDate(schedule.getDate());
        r.setWorkMode(schedule.getWorkMode().name());
        return r;
    }
}