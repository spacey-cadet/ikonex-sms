import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Ikonex Academy SMS",
  description: "Student Management System for Ikonex Academy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: "260px", padding: "32px", minHeight: "100vh", background: "var(--cream)" }}>
            {children}
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" } }} />
      </body>
    </html>
  );
}
