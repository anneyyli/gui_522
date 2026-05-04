import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HelpPanel from "./components/HelpPanel";

export const metadata: Metadata = {
  title: "HybridWork",
  description: "Desk booking and team scheduling for hybrid teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Sidebar />
        <div className="pl-0 md:pl-56">
          <Navbar />
          <main id="main-content" className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
        <HelpPanel />
      </body>
    </html>
  );
}
