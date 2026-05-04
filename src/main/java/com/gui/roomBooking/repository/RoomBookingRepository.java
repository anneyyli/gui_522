package com.gui.roomBooking.repository;

import com.gui.roomBooking.domain.RoomBooking;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class RoomBookingRepository {

    private final Map<String, RoomBooking> store = new ConcurrentHashMap<>();

    public void save(RoomBooking booking) {
        store.put(booking.getId(), booking);
    }

    public Optional<RoomBooking> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<RoomBooking> findByDate(LocalDate date) {
        return store.values().stream()
                .filter(b -> b.getDate().equals(date) && b.getStatus() == RoomBooking.BookingStatus.CONFIRMED)
                .toList();
    }

    public List<RoomBooking> findByEmployeeId(String employeeId) {
        return store.values().stream()
                .filter(b -> b.getEmployeeId().equals(employeeId))
                .toList();
    }
}
