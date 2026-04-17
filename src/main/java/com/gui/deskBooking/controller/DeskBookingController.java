package com.gui.deskBooking.controller;

import com.gui.deskBooking.dto.*;
import com.gui.deskBooking.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/desk-booking")
@RequiredArgsConstructor
public class DeskBookingController {

    private final DeskAvailabilityService availabilityService;
    private final ReservationService reservationService;

    public DeskBookingController(DeskAvailabilityService availabilityService, ReservationService reservationService) {
        this.availabilityService = availabilityService;
        this.reservationService = reservationService;
    }

    @GetMapping("/availability")
    public ResponseEntity<List<DeskAvailabilityResponse>> getAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailability(date));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.createBooking(request));
    }

    @GetMapping("/bookings/employee/{employeeId}")
    public ResponseEntity<List<BookingResponse>> getEmployeeBookings(@PathVariable String employeeId) {
        return ResponseEntity.ok(reservationService.getBookingsForEmployee(employeeId));
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingId) {
        reservationService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}