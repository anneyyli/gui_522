package com.gui.deskBooking.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FloorPlanResponse {
    private String site;
    private String floor;
    private int occupied;
    private int total;
    private List<FloorPlanDeskResponse> desks;
}
