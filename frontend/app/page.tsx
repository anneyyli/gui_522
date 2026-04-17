import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your hybrid working week.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/desk-booking" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
          <div className="text-teal-600 text-2xl mb-3">🪑</div>
          <h2 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Desk Booking</h2>
          <p className="text-sm text-gray-500 mt-1">Find and reserve a desk for your office days.</p>
        </Link>
        <Link href="/team-scheduling" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
          <div className="text-teal-600 text-2xl mb-3">📅</div>
          <h2 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Team Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">Plan and view your team's hybrid week.</p>
        </Link>
      </div>
    </div>
  );
}
