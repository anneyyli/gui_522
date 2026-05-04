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
        loadFromFile();
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