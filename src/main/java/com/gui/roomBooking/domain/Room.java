package com.gui.roomBooking.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Room {
    private String id;
    private String name;
    private int capacity;
    private String floor;
    private boolean hasWhiteboard;
    private boolean hasVideoConf;
}
