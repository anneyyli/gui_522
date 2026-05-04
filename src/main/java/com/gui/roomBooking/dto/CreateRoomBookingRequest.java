package com.gui.roomBooking.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CreateRoomBookingRequest {
    private String roomId;
    private String employeeId;
    private LocalDate date;
    private String timeSlot;
}
