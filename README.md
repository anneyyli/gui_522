# Hybrid Work Application

A full-stack application for managing desk bookings, meeting room reservations, team scheduling, and company dashboards with role-based access control.

## Architecture

- **Backend**: Spring Boot 4.0.2 (Java 23) — REST API with Spring Security session auth
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Data**: JSON file-based persistence (users, bookings, calendar events, desks, employees)

## Prerequisites

- **Java 23** — for running the Spring Boot backend
- **Node.js 18+** — for running the Next.js frontend
- **Maven 3.9+** — for building the backend (or use the pre-built JAR)
- **npm** — for managing frontend dependencies

## Quick Start

### Backend

1. From the project root, build and run:
```bash
mvn clean package
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

Alternatively, run the JAR directly (no Maven needed after initial build):
```bash
java -jar target/gui_522-1.0-SNAPSHOT.jar
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies and start the dev server:
```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Test Users

All users have password: `password123`

| Employee ID | Name          | Role         | Team        |
|-------------|---------------|--------------|-------------|
| E001        | Alice Johnson | Manager      | Engineering |
| E002        | Bob Smith     | Team Member  | Design      |
| E003        | Charlie Brown | Team Member  | Engineering |
| E004        | Diana Prince  | Team Member  | Product     |
| E005        | Eve Adams     | Team Member  | Engineering |
| E006        | Frank Miller  | HR           | HR          |
| E007        | Grace Chen    | HR           | HR          |

## Features

### Dashboard (role-based)
- **Manager**: Team attendance pie chart, direct reports Gantt schedule, team weekly view
- **Team Member**: Personal occupancy summary, team weekly schedule
- **HR**: Company-wide attendance summary, capacity alerts

### Desk Booking
- Interactive floor plan with zone-based layout across 3 floors
- Real-time availability with occupant initials shown
- Managers can book multiple desks; team members limited to 1 per day
- Meeting room booking with hourly time slots (09:00–17:00)

### Team Scheduling
- Weekly calendar grid showing colleagues' work modes
- Update personal status (Office / Remote / Out of Office)
- Plan Team Day tool for managers to find optimal in-office days

## Data Files

| File | Purpose |
|------|---------|
| `users.json` | User credentials, roles, team assignments, reporting hierarchy |
| `employees.json` | Employee directory (names, departments, job titles) |
| `bookings.json` | Desk reservations (desk ID, date, status) |
| `desks.json` | Office desk layout (floor, zone, equipment) |
| `calendar-events.json` | Weekly schedule events per employee |

## Troubleshooting

**Backend won't start** — Check Java 23 is installed (`java -version`) and port 8080 is free.

**Frontend shows blank page** — Ensure the backend is running, then check browser console. Try `npm cache clean --force` if dependencies seem stale.

**Login fails** — Credentials are in `users.json`. Ensure session cookies are enabled in your browser.

**No schedule data showing** — Check `calendar-events.json` exists and dates are within the current week range.
