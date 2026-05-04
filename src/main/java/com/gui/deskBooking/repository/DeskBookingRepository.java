package com.gui.deskBooking.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.gui.deskBooking.domain.DeskBooking;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class DeskBookingRepository {

    private final Map<String, DeskBooking> store = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private final File bookingsFile = new File("bookings.json");

    public DeskBookingRepository() {
        // Load existing bookings from JSON if file exists
        loadFromFile();

        // Add some default bookings if empty
        if (store.isEmpty()) {
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
            saveToFile();
        }
    }

    private void loadFromFile() {
        try {
            if (bookingsFile.exists()) {
                List<DeskBooking> bookings = objectMapper.readValue(bookingsFile,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, DeskBooking.class));
                bookings.forEach(booking -> store.put(booking.getId(), booking));
            }
        } catch (Exception e) {
            // If loading fails, start with empty store
            System.err.println("Failed to load bookings from file: " + e.getMessage());
        }
    }

    private void saveToFile() {
        try {
            List<DeskBooking> bookings = new ArrayList<>(store.values());
            objectMapper.writeValue(bookingsFile, bookings);
        } catch (Exception e) {
            System.err.println("Failed to save bookings to file: " + e.getMessage());
        }
    }

    public void save(DeskBooking booking) {
        store.put(booking.getId(), booking);
        saveToFile();
    }

    public Optional<DeskBooking> findById(String id) { return Optional.ofNullable(store.get(id)); }

    public List<DeskBooking> findByDate(LocalDate date) {
        return store.values().stream().filter(b -> b.getDate().equals(date)).toList();
    }

    public List<DeskBooking> findByEmployeeId(String employeeId) {
        return store.values().stream().filter(b -> b.getEmployeeId().equals(employeeId)).toList();
    }

    public List<DeskBooking> findAll() { return new ArrayList<>(store.values()); }
}