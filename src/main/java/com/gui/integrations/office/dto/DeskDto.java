package com.gui.integrations.office.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeskDto {
    private String id;
    private String label;
    private String floor;
    private String zone;
    private boolean hasMonitor;
    private boolean hasStandingOption;
}