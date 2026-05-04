package com.gui.roomBooking.domain;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomBooking {
    private String id;
    private String roomId;
    private String employeeId;
    private LocalDate date;
    private String timeSlot;
    private BookingStatus status;

    public enum BookingStatus { CONFIRMED, CANCELLED }
}
