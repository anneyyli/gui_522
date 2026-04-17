package com.gui.deskBooking.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponse {
    private String id;
    private String deskId;
    private String deskLabel;
    private String employeeId;
    private String employeeName;
    private LocalDate date;
    private String status;
}