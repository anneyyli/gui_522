# Hybrid Work Application

A full-stack application for managing desk bookings, team scheduling, and company dashboards with role-based access control.

## 🏗️ Architecture

- **Backend**: Spring Boot 4.0.2 (Java 23) - REST API with Spring Security
- **Frontend**: Next.js with TypeScript - Server-side rendering with client components
- **Data**: JSON file-based persistence (users, bookings, calendar events)

## 📋 Prerequisites

- **Java 23** - For running the Spring Boot backend
- **Node.js 18+** - For running the Next.js frontend
- **Maven** - For building the backend
- **npm** - For managing frontend dependencies

## 🚀 Quick Start

### Backend Setup

#### Option 1: Using Maven (Recommended for Development)

1. Navigate to the project root:
```bash
cd \gui_522
```

2. Build the project:
```bash
mvn clean package
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Option 2: Using Pre-built JAR (No Maven Required)

If the application has already been built, you can run it with just Java:

1. Navigate to the project root:
```bash
cd \gui_522
```

2. Run the JAR file directly:
```bash
java -jar target/gui_522-1.0-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

#### Option 3: Build Once, Run Without Maven

1. Build the project once with Maven:
```bash
mvn clean package
```

2. After that, you can run the JAR without Maven:
```bash
java -jar target/gui_522-1.0-SNAPSHOT.jar
```

No Maven needed for subsequent runs!

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd \gui_522\frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 👤 Test Users

All test users have password: `password123`

### Engineering Team
- **Alice Johnson** - Manager
  - Username: E001
  - Manages: Charlie Brown, Diana Prince

- **Bob Smith** - Team Member
  - Username: E002

### HR Team
- **Frank Miller** - HR
  - Username: E006

## 🎯 Key Features

### Dashboard
- **Manager Dashboard**: 
  - Team attendance charts (pie chart)
  - Direct reports Gantt schedule
  - Team weekly schedule

- **HR Dashboard**:
  - Company-wide attendance summary
  - HR team weekly schedule (no individual employee data)

- **Team Member Dashboard**:
  - Personal occupancy summary
  - Team weekly schedule

### Desk Booking
- Browse available desks with floor plans
- Book desks by date
- View personal bookings
- Managers can book multiple desks
- Team members limited to 1 desk per day

### Team Scheduling
- Weekly calendar view based on external calendar system
- Color-coded status (In Office, Remote, Out of Office, Pending)
- Team-based filtering - see colleagues on your team

## 🔐 Data Files

### users.json
Stores user information including:
- Employee ID & credentials
- Name, email, password
- Role (MANAGER, TEAM_MEMBER, HR)
- Team assignment
- Reporting hierarchy (reportsTo)

### bookings.json
Stores desk reservations:
- Booking ID, employee ID, desk ID
- Booking date and status
- Confirmation timestamps

### calendar-events.json
External calendar system integration:
- Daily schedule events for all employees
- Status (IN_OFFICE, REMOTE, OUT_OF_OFFICE)
- Event descriptions and types

## 📝 Notes

- The application uses JSON files for data persistence - not suitable for production
- Calendar events are for the week starting May 5, 2026 (Monday-Friday)
- All timestamps are in UTC
- CORS is configured to allow frontend requests from localhost:3000

## 🐛 Troubleshooting

### Backend won't start
- Ensure Java 23 is installed: `java -version`
- Check port 8080 is available
- Run `mvn clean` before rebuilding

### Frontend shows blank page
- Check browser console for errors
- Ensure backend is running on port 8080
- Clear cache: `npm cache clean --force`

### Login fails
- Verify credentials match users.json
- Check backend logs for authentication errors
- Ensure session cookies are enabled

### No calendar data showing
- Verify calendar-events.json exists and is valid JSON
- Check that current date is within event date range
