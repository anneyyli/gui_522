"use client";
import { useState } from "react";
import DeskAvailabilityGrid from "@/features/desk-booking/DeskAvailabilityGrid";
import MyBookings from "@/features/desk-booking/MyBookings";

const EMPLOYEE_ID = "E001";

export default function DeskBookingPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Desk Booking</h1>
        <p className="text-gray-500 mt-1 text-sm">Book a desk for your next office day.</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-medium text-gray-800 mb-4">Available Desks</h2>
          <DeskAvailabilityGrid
            date={date}
            employeeId={EMPLOYEE_ID}
            onBookingCreated={() => setRefresh(r => r + 1)}
          />
        </div>
        <div>
          <h2 className="font-medium text-gray-800 mb-4">My Bookings</h2>
          <MyBookings employeeId={EMPLOYEE_ID} refresh={refresh} />
        </div>
      </div>
    </div>
  );
}