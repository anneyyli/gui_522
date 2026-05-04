package com.gui.deskBooking.service;

import com.gui.deskBooking.domain.DeskBooking;
import com.gui.deskBooking.dto.BookingResponse;
import com.gui.deskBooking.dto.CreateBookingRequest;
import com.gui.deskBooking.dto.DeskAvailabilityResponse;
import com.gui.deskBooking.mapper.DeskBookingMapper;
import com.gui.deskBooking.repository.DeskBookingRepository;
import com.gui.integrations.hr.client.HrIntegrationClient;
import com.gui.integrations.office.client.OfficeIntegrationClient;
import com.gui.shared.exception.BadRequestException;
import com.gui.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final DeskBookingRepository bookingRepository;
    private final OfficeIntegrationClient officeClient;
    private final HrIntegrationClient hrClient;
    private final DeskBookingMapper mapper;

    public ReservationService(DeskBookingRepository bookingRepository, OfficeIntegrationClient officeClient, HrIntegrationClient hrClient, DeskBookingMapper mapper) {
        this.bookingRepository = bookingRepository;
        this.officeClient = officeClient;
        this.hrClient = hrClient;
        this.mapper = mapper;
    }

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

    public List<DeskAvailabilityResponse> getAvailability(LocalDate date) {
        var bookingsForDate = bookingRepository.findByDate(date);
        return officeClient.getAllDesks().stream()
                .map(desk -> {
                    DeskAvailabilityResponse response = new DeskAvailabilityResponse();
                    response.setDeskId(desk.getId());
                    response.setDeskLabel(desk.getLabel());
                    response.setFloor(desk.getFloor());
                    response.setZone(desk.getZone());
                    response.setHasMonitor(desk.isHasMonitor());
                    response.setHasStandingOption(desk.isHasStandingOption());
                    response.setAvailable(bookingsForDate.stream()
                            .noneMatch(b -> b.getDeskId().equals(desk.getId())
                                    && b.getStatus() == DeskBooking.BookingStatus.CONFIRMED));
                    return response;
                })
                .toList();
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