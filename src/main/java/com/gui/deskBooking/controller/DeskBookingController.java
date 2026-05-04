package com.gui.deskBooking.controller;

import com.gui.deskBooking.dto.BookingResponse;
import com.gui.deskBooking.dto.CreateBookingRequest;
import com.gui.deskBooking.dto.DeskAvailabilityResponse;
import com.gui.deskBooking.service.ReservationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/desk-booking")
public class DeskBookingController {

    private final ReservationService reservationService;

    public DeskBookingController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/availability")
    public List<DeskAvailabilityResponse> getAvailability(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reservationService.getAvailability(date);
    }

    @PostMapping("/bookings")
    public BookingResponse createBooking(@RequestBody CreateBookingRequest request) {
        return reservationService.createBooking(request);
    }

    @GetMapping("/bookings/employee/{employeeId}")
    public List<BookingResponse> getBookingsForEmployee(@PathVariable String employeeId) {
        return reservationService.getBookingsForEmployee(employeeId);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public void cancelBooking(@PathVariable String bookingId) {
        reservationService.cancelBooking(bookingId);
    }
}
