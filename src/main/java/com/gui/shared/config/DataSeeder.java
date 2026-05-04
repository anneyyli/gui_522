package com.gui.shared.config;

import com.gui.deskBooking.domain.DeskBooking;
import com.gui.deskBooking.repository.DeskBookingRepository;
import com.gui.integrations.office.client.OfficeIntegrationClient;
import com.gui.integrations.office.dto.DeskDto;
import com.gui.roomBooking.domain.RoomBooking;
import com.gui.roomBooking.repository.RoomBookingRepository;
import com.gui.teamScheduling.domain.TeamSchedule;
import com.gui.teamScheduling.repository.TeamScheduleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DeskBookingRepository deskBookingRepo;
    private final RoomBookingRepository roomBookingRepo;
    private final TeamScheduleRepository teamScheduleRepo;
    private final OfficeIntegrationClient officeClient;

    private static final String[] EMPLOYEE_IDS = {"E001", "E002", "E003", "E004", "E005", "E006"};
    private static final String[] ROOM_IDS = {"R001", "R002", "R003", "R004", "R005", "R006"};
    private static final String[] TIME_SLOTS = {
        "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
        "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    };

    public DataSeeder(DeskBookingRepository deskBookingRepo,
                      RoomBookingRepository roomBookingRepo,
                      TeamScheduleRepository teamScheduleRepo,
                      OfficeIntegrationClient officeClient) {
        this.deskBookingRepo = deskBookingRepo;
        this.roomBookingRepo = roomBookingRepo;
        this.teamScheduleRepo = teamScheduleRepo;
        this.officeClient = officeClient;
    }

    @Override
    public void run(String... args) {
        seedTeamSchedules();
        seedDeskBookings();
        seedRoomBookings();
    }

    private void seedTeamSchedules() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        Random rng = new Random(42);

        // Realistic hybrid patterns per employee
        // Tue-Thu are peak office days; Mon/Fri more remote
        TeamSchedule.WorkMode[][] patterns = {
            // E001 (Alice, Manager) — mostly office, WFH Fridays
            {TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE},
            // E002 (Bob) — 3 days office, prefers Tue-Thu
            {TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE},
            // E003 (Charlie) — alternating, in Mon/Wed/Fri
            {TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.OFFICE},
            // E004 (Diana) — 2 days office mid-week
            {TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE},
            // E005 (Eve) — office heavy Mon-Wed, leave Thu-Fri
            {TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.LEAVE, TeamSchedule.WorkMode.LEAVE},
            // E006 (Frank, HR) — standard hybrid 3 days
            {TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE, TeamSchedule.WorkMode.OFFICE, TeamSchedule.WorkMode.REMOTE},
        };

        int idCounter = 100;
        for (int emp = 0; emp < EMPLOYEE_IDS.length; emp++) {
            for (int day = 0; day < 5; day++) {
                TeamSchedule schedule = new TeamSchedule();
                schedule.setId("SEED-S" + (idCounter++));
                schedule.setEmployeeId(EMPLOYEE_IDS[emp]);
                schedule.setDate(monday.plusDays(day));
                schedule.setWorkMode(patterns[emp][day]);
                if (patterns[emp][day] == TeamSchedule.WorkMode.OFFICE) {
                    schedule.setOfficeLocation("Birmingham - Floor 4");
                }
                teamScheduleRepo.save(schedule);
            }
        }
    }

    private void seedDeskBookings() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        List<DeskDto> allDesks = officeClient.getAllDesks();
        Random rng = new Random(123);

        // Realistic occupancy: Mon ~40%, Tue ~65%, Wed ~70%, Thu ~60%, Fri ~30%
        double[] occupancyRates = {0.40, 0.65, 0.70, 0.60, 0.30};

        int bookingId = 1000;
        for (int day = 0; day < 5; day++) {
            LocalDate date = monday.plusDays(day);
            int desksToBook = (int) (allDesks.size() * occupancyRates[day]);

            List<DeskDto> shuffled = new ArrayList<>(allDesks);
            Collections.shuffle(shuffled, rng);

            for (int i = 0; i < desksToBook; i++) {
                DeskBooking booking = new DeskBooking();
                booking.setId("SEED-B" + (bookingId++));
                booking.setDeskId(shuffled.get(i).getId());
                // Distribute among employees and some "external" employee IDs
                String empId = i < EMPLOYEE_IDS.length
                    ? EMPLOYEE_IDS[i]
                    : "EXT" + String.format("%03d", (i % 30) + 1);
                booking.setEmployeeId(empId);
                booking.setDate(date);
                booking.setStatus(DeskBooking.BookingStatus.CONFIRMED);
                deskBookingRepo.save(booking);
            }
        }
    }

    private void seedRoomBookings() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        Random rng = new Random(456);

        int roomBookingId = 500;
        for (int day = 0; day < 5; day++) {
            LocalDate date = monday.plusDays(day);

            // Book 3-5 room slots per day across different rooms
            int slotsToBook = 3 + rng.nextInt(3);
            Set<String> usedSlots = new HashSet<>();

            for (int i = 0; i < slotsToBook; i++) {
                String roomId = ROOM_IDS[rng.nextInt(ROOM_IDS.length)];
                String timeSlot = TIME_SLOTS[rng.nextInt(TIME_SLOTS.length)];
                String key = roomId + "-" + timeSlot;

                if (usedSlots.contains(key)) continue;
                usedSlots.add(key);

                RoomBooking booking = new RoomBooking();
                booking.setId("SEED-RB" + (roomBookingId++));
                booking.setRoomId(roomId);
                booking.setEmployeeId(EMPLOYEE_IDS[rng.nextInt(EMPLOYEE_IDS.length)]);
                booking.setDate(date);
                booking.setTimeSlot(timeSlot);
                booking.setStatus(RoomBooking.BookingStatus.CONFIRMED);
                roomBookingRepo.save(booking);
            }
        }
    }
}
