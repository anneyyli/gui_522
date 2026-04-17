package com.gui.deskBooking.service;

import com.gui.deskBooking.dto.DeskAvailabilityResponse;
import com.gui.deskBooking.repository.DeskBookingRepository;
import com.gui.integrations.office.client.OfficeIntegrationClient;
import com.gui.integrations.office.dto.DeskDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeskAvailabilityService {

    private final OfficeIntegrationClient officeClient;
    private final DeskBookingRepository bookingRepository;

    public DeskAvailabilityService(OfficeIntegrationClient officeClient, DeskBookingRepository bookingRepository) {
        this.officeClient = officeClient;
        this.bookingRepository = bookingRepository;
    }

    public List<DeskAvailabilityResponse> getAvailability(LocalDate date) {
        List<DeskDto> allDesks = officeClient.getAllDesks();
        Set<String> bookedDeskIds = bookingRepository.findByDate(date).stream()
                .map(b -> b.getDeskId())
                .collect(Collectors.toSet());

        return allDesks.stream().map(desk -> {
            DeskAvailabilityResponse r = new DeskAvailabilityResponse();
            r.setDeskId(desk.getId());
            r.setDeskLabel(desk.getLabel());
            r.setFloor(desk.getFloor());
            r.setZone(desk.getZone());
            r.setHasMonitor(desk.isHasMonitor());
            r.setHasStandingOption(desk.isHasStandingOption());
            r.setAvailable(!bookedDeskIds.contains(desk.getId()));
            return r;
        }).toList();
    }
}