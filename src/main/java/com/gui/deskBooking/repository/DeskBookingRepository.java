package com.gui.deskBooking.repository;

import com.gui.deskBooking.domain.DeskBooking;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class DeskBookingRepository {

    private final Map<String, DeskBooking> store = new ConcurrentHashMap<>();

    public DeskBookingRepository() {
        DeskBooking booking1 = new DeskBooking();
        booking1.setId("B001");
        booking1.setDeskId("D001");
        booking1.setEmployeeId("E001");
        booking1.setDate(LocalDate.now().plusDays(1));
        booking1.setStatus(DeskBooking.BookingStatus.CONFIRMED);

        DeskBooking booking2 = new DeskBooking();
        booking2.setId("B002");
        booking2.setDeskId("D002");
        booking2.setEmployeeId("E002");
        booking2.setDate(LocalDate.now().plusDays(2));
        booking2.setStatus(DeskBooking.BookingStatus.CONFIRMED);

        store.put(booking1.getId(), booking1);
        store.put(booking2.getId(), booking2);
    }

    public void save(DeskBooking booking) { store.put(booking.getId(), booking); }

    public Optional<DeskBooking> findById(String id) { return Optional.ofNullable(store.get(id)); }

    public List<DeskBooking> findByDate(LocalDate date) {
        return store.values().stream().filter(b -> b.getDate().equals(date)).toList();
    }

    public List<DeskBooking> findByEmployeeId(String employeeId) {
        return store.values().stream().filter(b -> b.getEmployeeId().equals(employeeId)).toList();
    }

    public List<DeskBooking> findAll() { return new ArrayList<>(store.values()); }
}