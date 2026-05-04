package com.gui.roomBooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RoomBookingResponse {
    private String id;
    private String roomId;
    private String roomName;
    private String employeeId;
    private LocalDate date;
    private String timeSlot;
    private String status;
}
