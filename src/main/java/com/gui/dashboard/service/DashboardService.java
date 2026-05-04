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
import com.gui.integrations.office.client.OfficeIntegrationClient;
import com.gui.roomBooking.repository.RoomBookingRepository;
import com.gui.roomBooking.repository.RoomRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DeskBookingRepository bookingRepository;
    private final OfficeIntegrationClient officeClient;
    private final RoomRepository roomRepository;
    private final RoomBookingRepository roomBookingRepository;

    public DashboardService(DeskBookingRepository bookingRepository, OfficeIntegrationClient officeClient,
                            RoomRepository roomRepository, RoomBookingRepository roomBookingRepository) {
        this.bookingRepository = bookingRepository;
        this.officeClient = officeClient;
        this.roomRepository = roomRepository;
        this.roomBookingRepository = roomBookingRepository;
    }

    public DashboardResponse getDashboard(String employeeId) {
        String role = getUserRole(employeeId);

        DashboardResponse response = new DashboardResponse();

        // Calculate occupancy from today's bookings
        LocalDate today = LocalDate.now();
        List<DeskBooking> todaysBookings = bookingRepository.findByDate(today);
        int occupiedDesks = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == DeskBooking.BookingStatus.CONFIRMED)
            .count();
        int totalDesks = officeClient.getAllDesks().size();
        response.setOccupiedDesks(occupiedDesks);
        response.setTotalDesks(totalDesks);
        int totalRooms = roomRepository.findAll().size();
        int roomsWithBookings = (int) roomBookingRepository.findByDate(today).stream()
                .map(b -> b.getRoomId())
                .distinct()
                .count();
        response.setOccupiedRooms(roomsWithBookings);
        response.setTotalRooms(totalRooms);
        response.setSite("Birmingham");
        response.setFloor("Floor 4 - Engineering");

        if ("MANAGER".equals(role)) {
            // For managers, add team attendance charts
            response.setTeamAttendanceCharts(getTeamAttendanceCharts(employeeId));
            response.setDirectReportsGantt(getDirectReportsGantt(employeeId));
        } else if ("HR".equals(role)) {
            // For HR, add company-wide attendance summary
            response.setHrAttendanceSummary(getHrAttendanceSummary());
        }

        // Build team schedule from calendar system
        List<WeeklyScheduleRowResponse> teamSchedule = buildTeamScheduleFromCalendar(employeeId, role);

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

    private String getUserTeam(String employeeId) {
        try {
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> users = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            return users.stream()
                .filter(u -> employeeId.equals(u.get("employeeId")))
                .map(u -> (String) u.get("team"))
                .findFirst()
                .orElse("Engineering");
        } catch (Exception e) {
            return "Engineering";
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

    private Map<String, Object> getHrAttendanceSummary() {
        // Calculate company-wide attendance summary
        int officeCount = 0;
        int wfhCount = 0;
        int oooCount = 0;

        // Mock company-wide attendance data - in real app, this would come from HR system
        List<Map<String, Object>> companyAttendance = List.of(
            Map.of("status", "IN_OFFICE", "count", 45),
            Map.of("status", "REMOTE", "count", 32),
            Map.of("status", "OUT_OF_OFFICE", "count", 8)
        );

        for (Map<String, Object> attendance : companyAttendance) {
            String status = (String) attendance.get("status");
            int count = (Integer) attendance.get("count");
            switch (status) {
                case "IN_OFFICE" -> officeCount += count;
                case "REMOTE" -> wfhCount += count;
                case "OUT_OF_OFFICE" -> oooCount += count;
            }
        }

        return Map.of(
            "officeCount", officeCount,
            "wfhCount", wfhCount,
            "oooCount", oooCount,
            "totalEmployees", officeCount + wfhCount + oooCount
        );
    }

    private List<WeeklyScheduleRowResponse> buildTeamScheduleFromCalendar(String employeeId, String role) {
        List<WeeklyScheduleRowResponse> teamSchedule = new ArrayList<>();

        try {
            // Read calendar events from external system
            java.io.File calendarFile = new java.io.File("calendar-events.json");
            List<Map<String, Object>> calendarEvents = objectMapper.readValue(calendarFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Get current week dates (Monday to Friday)
            LocalDate today = LocalDate.now();
            LocalDate monday = today.with(java.time.DayOfWeek.MONDAY);
            List<LocalDate> weekDates = new ArrayList<>();
            for (int i = 0; i < 5; i++) {
                weekDates.add(monday.plusDays(i));
            }

            // Group events by employee and filter for current week
            Map<String, List<Map<String, Object>>> eventsByEmployee = calendarEvents.stream()
                .filter(event -> {
                    String eventDateStr = (String) event.get("date");
                    LocalDate eventDate = LocalDate.parse(eventDateStr);
                    return weekDates.contains(eventDate);
                })
                .collect(Collectors.groupingBy(event -> (String) event.get("employeeId")));

            // Get user's team
            String userTeam = getUserTeam(employeeId);

            // Get all users to filter by team
            java.io.File usersFile = new java.io.File("users.json");
            List<Map<String, Object>> allUsers = objectMapper.readValue(usersFile,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Determine which employees to show based on team
            java.util.Set<String> employeesToShow = new java.util.HashSet<>();

            // All users show their team members from calendar events
            for (Map<String, Object> user : allUsers) {
                String userId = (String) user.get("employeeId");
                String usersTeam = (String) user.get("team");
                
                if (userTeam.equals(usersTeam) && eventsByEmployee.containsKey(userId)) {
                    employeesToShow.add(userId);
                }
            }

            // Build schedule rows for each employee
            for (String empId : employeesToShow) {
                List<Map<String, Object>> employeeEvents = eventsByEmployee.get(empId);
                if (employeeEvents == null || employeeEvents.isEmpty()) {
                    continue;
                }

                // Sort events by date
                employeeEvents.sort((a, b) -> ((String) a.get("date")).compareTo((String) b.get("date")));

                // Get employee info from first event
                Map<String, Object> firstEvent = employeeEvents.get(0);
                String empName = (String) firstEvent.get("employeeName");
                String empRole = (String) firstEvent.get("role");

                // Build days array
                List<String> days = new ArrayList<>();
                for (LocalDate date : weekDates) {
                    String dateStr = date.toString();
                    String status = employeeEvents.stream()
                        .filter(event -> dateStr.equals(event.get("date")))
                        .map(event -> (String) event.get("status"))
                        .findFirst()
                        .orElse("PENDING");
                    days.add(status);
                }

                WeeklyScheduleRowResponse row = new WeeklyScheduleRowResponse();
                row.setEmployeeId(empId);
                row.setName(empName);
                row.setRole("HR".equals(empRole) ? "HR" : "Manager".equals(empRole) ? "Manager" : "Team Member");
                row.setDays(days);
                teamSchedule.add(row);
            }

        } catch (Exception e) {
            // Fallback to basic mock data if calendar system fails
            WeeklyScheduleRowResponse fallback = new WeeklyScheduleRowResponse();
            fallback.setEmployeeId("fallback");
            fallback.setName("Team Member");
            fallback.setRole("Team Member");
            fallback.setDays(List.of("REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"));
            teamSchedule.add(fallback);
        }

        return teamSchedule;
    }
}
