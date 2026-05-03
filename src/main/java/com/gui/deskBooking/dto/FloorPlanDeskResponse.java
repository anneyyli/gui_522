package com.gui.deskBooking.dto;

public class FloorPlanDeskResponse {
    private String id;
    private String label;
    private String status;
    private String initials;
    private String locationDescription;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }

    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }
}
