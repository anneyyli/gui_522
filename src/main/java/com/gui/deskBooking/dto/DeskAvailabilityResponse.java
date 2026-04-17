package com.gui.deskBooking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeskAvailabilityResponse {
    private String deskId;
    private String deskLabel;
    private String floor;
    private String zone;
    private boolean hasMonitor;
    private boolean hasStandingOption;
    private boolean available;
}