package com.gui.deskBooking.service;

import com.gui.deskBooking.domain.DeskBooking;
import com.gui.deskBooking.dto.BookingResponse;
import com.gui.deskBooking.dto.CreateBookingRequest;
import com.gui.deskBooking.mapper.DeskBookingMapper;
import com.gui.deskBooking.repository.DeskBookingRepository;
import com.gui.integrations.hr.client.HrIntegrationClient;
import com.gui.integrations.office.client.OfficeIntegrationClient;
import com.gui.shared.exception.BadRequestException;
import com.gui.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final DeskBookingRepository bookingRepository;
    private final OfficeIntegrationClient officeClient;
    private final HrIntegrationClient hrClient;
    private final DeskBookingMapper mapper;

    public BookingResponse createBooking(CreateBookingRequest request) {
        boolean alreadyBooked = bookingRepository.findByDate(request.getDate()).stream()
                .anyMatch(b -> b.getDeskId().equals(request.getDeskId())
                        && b.getStatus() == DeskBooking.BookingStatus.CONFIRMED);
        if (alreadyBooked) throw new BadRequestException("Desk is already booked for this date.");

        DeskBooking booking = new DeskBooking();
        booking.setId(UUID.randomUUID().toString());
        booking.setDeskId(request.getDeskId());
        booking.setEmployeeId(request.getEmployeeId());
        booking.setDate(request.getDate());
        booking.setStatus(DeskBooking.BookingStatus.CONFIRMED);

        bookingRepository.save(booking);

        var desk = officeClient.getAllDesks().stream()
                .filter(d -> d.getId().equals(request.getDeskId()))
                .findFirst().orElse(null);
        var employee = hrClient.getEmployeeById(request.getEmployeeId());

        return mapper.toResponse(booking, desk, employee);
    }

    public List<BookingResponse> getBookingsForEmployee(String employeeId) {
        return bookingRepository.findByEmployeeId(employeeId).stream()
                .map(b -> {
                    var desk = officeClient.getAllDesks().stream()
                            .filter(d -> d.getId().equals(b.getDeskId()))
                            .findFirst().orElse(null);
                    var employee = hrClient.getEmployeeById(employeeId);
                    return mapper.toResponse(b, desk, employee);
                }).toList();
    }

    public void cancelBooking(String bookingId) {
        DeskBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        booking.setStatus(DeskBooking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}