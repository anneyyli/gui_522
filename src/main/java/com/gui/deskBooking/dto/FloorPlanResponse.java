package com.gui.deskBooking.dto;

import java.util.List;

public class FloorPlanResponse {
    private String site;
    private String floor;
    private int occupied;
    private int total;
    private List<FloorPlanDeskResponse> desks;

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public int getOccupied() { return occupied; }
    public void setOccupied(int occupied) { this.occupied = occupied; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public List<FloorPlanDeskResponse> getDesks() { return desks; }
    public void setDesks(List<FloorPlanDeskResponse> desks) { this.desks = desks; }
}
