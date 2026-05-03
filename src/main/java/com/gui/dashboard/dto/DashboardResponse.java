package com.gui.dashboard.dto;

import java.util.List;

public class DashboardResponse {
    private int occupiedDesks;
    private int totalDesks;
    private int occupiedRooms;
    private int totalRooms;
    private String site;
    private String floor;
    private List<WeeklyScheduleRowResponse> teamSchedule;

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

}
