package com.gui.dashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gui.dashboard.dto.DashboardResponse;
import com.gui.dashboard.dto.WeeklyScheduleRowResponse;
import com.gui.deskBooking.domain.DeskBooking;
import com.gui.deskBooking.repository.DeskBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DeskBookingRepository bookingRepository;

    public DashboardResponse getDashboard(String employeeId) {
        String role = getUserRole(employeeId);

        DashboardResponse response = new DashboardResponse();

        // Calculate occupancy from today's bookings
        LocalDate today = LocalDate.now();
        List<DeskBooking> todaysBookings = bookingRepository.findByDate(today);
        int occupiedDesks = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == DeskBooking.BookingStatus.CONFIRMED)
            .count();
        response.setOccupiedDesks(occupiedDesks);
        response.setTotalDesks(50); // Assuming fixed total
        response.setOccupiedRooms(4); // Mock
        response.setTotalRooms(6); // Mock
        response.setSite("Birmingham");
        response.setFloor("Floor 4 - Engineering");

        if ("MANAGER".equals(role)) {
            // For managers, add team attendance charts
            response.setTeamAttendanceCharts(getTeamAttendanceCharts(employeeId));
            response.setDirectReportsGantt(getDirectReportsGantt(employeeId));
        }

        // Build team schedule from actual users
        List<WeeklyScheduleRowResponse> teamSchedule = new ArrayList<>();

        // Add manager
        WeeklyScheduleRowResponse manager = new WeeklyScheduleRowResponse();
        manager.setName(getUserName(employeeId));
        manager.setRole("Manager");
        manager.setDays(List.of("IN_OFFICE", "REMOTE", "IN_OFFICE", "IN_OFFICE", "OUT_OF_OFFICE"));
        teamSchedule.add(manager);

        // Add direct reports
        List<String> directReports = getDirectReports(employeeId);
        for (String reportId : directReports) {
            WeeklyScheduleRowResponse report = new WeeklyScheduleRowResponse();
            report.setName(getUserName(reportId));
            report.setRole("Team Member");
            // Mock schedule - in real app, this would come from attendance system
            report.setDays(List.of("IN_OFFICE", "REMOTE", "IN_OFFICE", "OOO", "IN_OFFICE"));
            teamSchedule.add(report);
        }

        // Add other team members (not direct reports)
        try {
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> allUsers = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            for (Map<String, Object> user : allUsers) {
                String userId = (String) user.get("employeeId");
                if (!userId.equals(employeeId) && !directReports.contains(userId)) {
                    WeeklyScheduleRowResponse member = new WeeklyScheduleRowResponse();
                    member.setName((String) user.get("name"));
                    member.setRole("Team Member");
                    member.setDays(List.of("REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"));
                    teamSchedule.add(member);
                }
            }
        } catch (Exception e) {
            // Fallback to mock data if file read fails
            WeeklyScheduleRowResponse fallback = new WeeklyScheduleRowResponse();
            fallback.setName("Team Member");
            fallback.setRole("Team Member");
            fallback.setDays(List.of("REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"));
            teamSchedule.add(fallback);
        }

        response.setTeamSchedule(teamSchedule);
        return response;
    }

    private String getUserRole(String employeeId) {
        try {
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            return users.stream()
                .filter(u -> employeeId.equals(u.get("employeeId")))
                .map(u -> (String) u.get("role"))
                .findFirst()
                .orElse("TEAM_MEMBER");
        } catch (Exception e) {
            return "TEAM_MEMBER";
        }
    }

    private Map<String, Object> getTeamAttendanceCharts(String managerId) {
        List<String> directReports = getDirectReports(managerId);

        // Calculate attendance from team schedule data
        int officeCount = 0;
        int wfhCount = 0;
        int oooCount = 0;

        // Mock team schedule data - in real app, this would come from a proper attendance system
        List<Map<String, Object>> teamSchedule = List.of(
            Map.of("name", "Charlie Brown", "days", List.of("IN_OFFICE", "IN_OFFICE", "REMOTE", "IN_OFFICE", "REMOTE")),
            Map.of("name", "Diana Prince", "days", List.of("IN_OFFICE", "REMOTE", "IN_OFFICE", "OOO", "IN_OFFICE")),
            Map.of("name", "Eve Adams", "days", List.of("REMOTE", "REMOTE", "IN_OFFICE", "IN_OFFICE", "OOO"))
        );

        for (Map<String, Object> member : teamSchedule) {
            @SuppressWarnings("unchecked")
            List<String> days = (List<String>) member.get("days");
            for (String day : days) {
                switch (day) {
                    case "IN_OFFICE" -> officeCount++;
                    case "REMOTE" -> wfhCount++;
                    case "OUT_OF_OFFICE", "OOO" -> oooCount++;
                }
            }
        }

        return Map.of(
            "officeAttendance", List.of(officeCount), // Single value for pie chart
            "wfh", List.of(wfhCount),
            "ooo", List.of(oooCount)
        );
    }

    private Map<String, Object> getDirectReportsGantt(String managerId) {
        List<String> directReports = getDirectReports(managerId);
        // Return actual direct reports with their schedules
        return Map.of(
            "reports", directReports.stream().map(reportId -> Map.of(
                "employeeId", reportId,
                "name", getUserName(reportId),
                "schedule", List.of("IN_OFFICE", "REMOTE", "IN_OFFICE", "OOO", "IN_OFFICE")
            )).collect(Collectors.toList())
        );
    }

    private List<String> getDirectReports(String managerId) {
        try {
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            return users.stream()
                .filter(u -> managerId.equals(u.get("reportsTo")))
                .map(u -> (String) u.get("employeeId"))
                .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }

    private String getUserName(String employeeId) {
        try {
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            return users.stream()
                .filter(u -> employeeId.equals(u.get("employeeId")))
                .map(u -> (String) u.get("name"))
                .findFirst()
                .orElse(employeeId);
        } catch (Exception e) {
            return employeeId;
        }
    }
}
