package com.gui.roomBooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RoomAvailabilityResponse {
    private String roomId;
    private String name;
    private int capacity;
    private String floor;
    private boolean hasWhiteboard;
    private boolean hasVideoConf;
    private List<String> bookedSlots;
}
