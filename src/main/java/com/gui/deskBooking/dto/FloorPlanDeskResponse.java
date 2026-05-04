package com.gui.deskBooking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FloorPlanDeskResponse {
    private String id;
    private String label;
    private String status;
    private String initials;
    private String locationDescription;
    private int x;
    private int y;
}
