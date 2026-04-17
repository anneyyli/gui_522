package com.gui.deskBooking.domain;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeskBooking {
    private String id;
    private String deskId;
    private String employeeId;
    private LocalDate date;
    private BookingStatus status;

    public enum BookingStatus { CONFIRMED, CANCELLED }
}