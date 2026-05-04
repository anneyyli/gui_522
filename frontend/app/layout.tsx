import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "HybridWork",
  description: "Desk booking and team scheduling for hybrid teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="pl-56">
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
