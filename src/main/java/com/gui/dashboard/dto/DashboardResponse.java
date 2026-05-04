package com.gui.dashboard.dto;

import java.util.List;
import java.util.Map;

public class DashboardResponse {
    private int occupiedDesks;
    private int totalDesks;
    private int occupiedRooms;
    private int totalRooms;
    private String site;
    private String floor;
    private List<WeeklyScheduleRowResponse> teamSchedule;
    private Map<String, Object> teamAttendanceCharts;
    private Map<String, Object> directReportsGantt;
    private Map<String, Object> hrAttendanceSummary;

    public int getOccupiedDesks() { return occupiedDesks; }
    public void setOccupiedDesks(int occupiedDesks) { this.occupiedDesks = occupiedDesks; }

    public int getTotalDesks() { return totalDesks; }
    public void setTotalDesks(int totalDesks) { this.totalDesks = totalDesks; }

    public int getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(int occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public int getTotalRooms() { return totalRooms; }
    public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public List<WeeklyScheduleRowResponse> getTeamSchedule() { return teamSchedule; }
    public void setTeamSchedule(List<WeeklyScheduleRowResponse> teamSchedule) { this.teamSchedule = teamSchedule; }

    public Map<String, Object> getTeamAttendanceCharts() { return teamAttendanceCharts; }
    public void setTeamAttendanceCharts(Map<String, Object> teamAttendanceCharts) { this.teamAttendanceCharts = teamAttendanceCharts; }

    public Map<String, Object> getDirectReportsGantt() { return directReportsGantt; }
    public void setDirectReportsGantt(Map<String, Object> directReportsGantt) { this.directReportsGantt = directReportsGantt; }

    public Map<String, Object> getHrAttendanceSummary() { return hrAttendanceSummary; }
    public void setHrAttendanceSummary(Map<String, Object> hrAttendanceSummary) { this.hrAttendanceSummary = hrAttendanceSummary; }

    private List<Map<String, Object>> weeklyTrend;
    public List<Map<String, Object>> getWeeklyTrend() { return weeklyTrend; }
    public void setWeeklyTrend(List<Map<String, Object>> weeklyTrend) { this.weeklyTrend = weeklyTrend; }

}
