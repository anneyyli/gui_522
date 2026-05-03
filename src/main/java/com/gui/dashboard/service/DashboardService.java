package com.gui.dashboard.service;

import java.util.List;

import com.gui.dashboard.dto.DashboardResponse;
import com.gui.dashboard.dto.WeeklyScheduleRowResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    public DashboardResponse getDashboard() {
        DashboardResponse response = new DashboardResponse();
        response.setOccupiedDesks(42);
        response.setTotalDesks(50);
        response.setOccupiedRooms(4);
        response.setTotalRooms(6);
        response.setSite("Birmingham");
        response.setFloor("Floor 4 - Engineering");

        WeeklyScheduleRowResponse alice = new WeeklyScheduleRowResponse();
        alice.setName("Alice Johnson");
        alice.setRole("Manager");
        alice.setDays(List.of("IN_OFFICE", "REMOTE", "IN_OFFICE", "IN_OFFICE", "OUT_OF_OFFICE"));

        WeeklyScheduleRowResponse bob = new WeeklyScheduleRowResponse();
        bob.setName("Bob Smith");
        bob.setRole("Engineer");
        bob.setDays(List.of("REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"));

        WeeklyScheduleRowResponse carol = new WeeklyScheduleRowResponse();
        carol.setName("Carol White");
        carol.setRole("Engineer");
        carol.setDays(List.of("IN_OFFICE", "IN_OFFICE", "IN_OFFICE", "REMOTE", "REMOTE"));

        response.setTeamSchedule(List.of(alice, bob, carol));
        return response;
    }
}
