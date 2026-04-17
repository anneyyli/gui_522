import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 border-b border-gray-200 bg-white flex items-center px-6 gap-8">
      <span className="font-semi-bold text-teal-700 text-base tracking-tight">HybridWork</span>
      <div className="flex gap-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">Dashboard</Link>
        <Link href="/desk-booking" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">Desk Booking</Link>
        <Link href="/team-scheduling" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">Team Schedule</Link>
      </div>
    </nav>
  );
}