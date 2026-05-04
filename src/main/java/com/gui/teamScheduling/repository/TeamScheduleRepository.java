package com.gui.teamScheduling.repository;

import com.gui.teamScheduling.domain.TeamSchedule;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class TeamScheduleRepository {

    private final Map<String, TeamSchedule> store = new ConcurrentHashMap<>();

    public TeamScheduleRepository() {
    }

    public void save(TeamSchedule schedule) { store.put(schedule.getId(), schedule); }

    public Optional<TeamSchedule> findById(String id) { return Optional.ofNullable(store.get(id)); }

    public List<TeamSchedule> findByDate(LocalDate date) {
        return store.values().stream().filter(s -> s.getDate().equals(date)).toList();
    }

    public List<TeamSchedule> findByEmployeeId(String employeeId) {
        return store.values().stream().filter(s -> s.getEmployeeId().equals(employeeId)).toList();
    }

    public List<TeamSchedule> findByDateBetween(LocalDate from, LocalDate to) {
        return store.values().stream()
                .filter(s -> !s.getDate().isBefore(from) && !s.getDate().isAfter(to))
                .toList();
    }

    public List<TeamSchedule> findAll() { return new ArrayList<>(store.values()); }
}