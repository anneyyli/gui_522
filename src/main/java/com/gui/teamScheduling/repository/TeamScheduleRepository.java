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
        TeamSchedule schedule1 = new TeamSchedule();
        schedule1.setId("S001");
        schedule1.setEmployeeId("E001");
        schedule1.setDate(LocalDate.now().plusDays(1));
        schedule1.setWorkMode(TeamSchedule.WorkMode.OFFICE);
        schedule1.setOfficeLocation("Main Office");

        TeamSchedule schedule2 = new TeamSchedule();
        schedule2.setId("S002");
        schedule2.setEmployeeId("E002");
        schedule2.setDate(LocalDate.now().plusDays(1));
        schedule2.setWorkMode(TeamSchedule.WorkMode.REMOTE);
        schedule2.setOfficeLocation(null);

        TeamSchedule schedule3 = new TeamSchedule();
        schedule3.setId("S003");
        schedule3.setEmployeeId("E001");
        schedule3.setDate(LocalDate.now().plusDays(2));
        schedule3.setWorkMode(TeamSchedule.WorkMode.OFFICE);
        schedule3.setOfficeLocation("Branch Office");

        store.put(schedule1.getId(), schedule1);
        store.put(schedule2.getId(), schedule2);
        store.put(schedule3.getId(), schedule3);
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