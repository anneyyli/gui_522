package com.gui.deskBooking.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {
    private String deskId;
    private String employeeId;
    private LocalDate date;
}