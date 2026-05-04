package com.gui.roomBooking.controller;

import com.gui.roomBooking.domain.Room;
import com.gui.roomBooking.domain.RoomBooking;
import com.gui.roomBooking.dto.CreateRoomBookingRequest;
import com.gui.roomBooking.dto.RoomAvailabilityResponse;
import com.gui.roomBooking.dto.RoomBookingResponse;
import com.gui.roomBooking.repository.RoomBookingRepository;
import com.gui.roomBooking.repository.RoomRepository;
import com.gui.shared.exception.BadRequestException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for meeting room bookings. Rooms use hourly time slots
 * (09:00-17:00) rather than full-day reservations, reflecting stakeholder
 * feedback that meetings are typically 1-2 hours and rooms should be shared.
 * Availability is returned per-room with booked slots greyed out in the UI.
 */
@RestController
@RequestMapping("/api/room-booking")
public class RoomBookingController {

    private final RoomRepository roomRepository;
    private final RoomBookingRepository bookingRepository;

    public RoomBookingController(RoomRepository roomRepository, RoomBookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/rooms")
    public List<RoomAvailabilityResponse> getRoomAvailability(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        var bookingsForDate = bookingRepository.findByDate(date);
        return roomRepository.findAll().stream().map(room -> {
            RoomAvailabilityResponse resp = new RoomAvailabilityResponse();
            resp.setRoomId(room.getId());
            resp.setName(room.getName());
            resp.setCapacity(room.getCapacity());
            resp.setFloor(room.getFloor());
            resp.setHasWhiteboard(room.isHasWhiteboard());
            resp.setHasVideoConf(room.isHasVideoConf());
            resp.setBookedSlots(bookingsForDate.stream()
                    .filter(b -> b.getRoomId().equals(room.getId()))
                    .map(RoomBooking::getTimeSlot)
                    .toList());
            return resp;
        }).toList();
    }

    @PostMapping("/bookings")
    public RoomBookingResponse createBooking(@RequestBody CreateRoomBookingRequest request) {
        var existingBookings = bookingRepository.findByDate(request.getDate());
        boolean slotTaken = existingBookings.stream()
                .anyMatch(b -> b.getRoomId().equals(request.getRoomId())
                        && b.getTimeSlot().equals(request.getTimeSlot()));
        if (slotTaken) {
            throw new BadRequestException("This room is already booked for that time slot.");
        }

        RoomBooking booking = new RoomBooking();
        booking.setId(UUID.randomUUID().toString());
        booking.setRoomId(request.getRoomId());
        booking.setEmployeeId(request.getEmployeeId());
        booking.setDate(request.getDate());
        booking.setTimeSlot(request.getTimeSlot());
        booking.setStatus(RoomBooking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        Room room = roomRepository.findById(request.getRoomId()).orElse(null);

        RoomBookingResponse resp = new RoomBookingResponse();
        resp.setId(booking.getId());
        resp.setRoomId(booking.getRoomId());
        resp.setRoomName(room != null ? room.getName() : booking.getRoomId());
        resp.setEmployeeId(booking.getEmployeeId());
        resp.setDate(booking.getDate());
        resp.setTimeSlot(booking.getTimeSlot());
        resp.setStatus(booking.getStatus().name());
        return resp;
    }

    @GetMapping("/bookings/employee/{employeeId}")
    public List<RoomBookingResponse> getBookingsForEmployee(@PathVariable String employeeId) {
        return bookingRepository.findByEmployeeId(employeeId).stream()
                .map(b -> {
                    Room room = roomRepository.findById(b.getRoomId()).orElse(null);
                    RoomBookingResponse resp = new RoomBookingResponse();
                    resp.setId(b.getId());
                    resp.setRoomId(b.getRoomId());
                    resp.setRoomName(room != null ? room.getName() : b.getRoomId());
                    resp.setEmployeeId(b.getEmployeeId());
                    resp.setDate(b.getDate());
                    resp.setTimeSlot(b.getTimeSlot());
                    resp.setStatus(b.getStatus().name());
                    return resp;
                })
                .toList();
    }

    @DeleteMapping("/bookings/{bookingId}")
    public void cancelBooking(@PathVariable String bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BadRequestException("Booking not found."));
        booking.setStatus(RoomBooking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
