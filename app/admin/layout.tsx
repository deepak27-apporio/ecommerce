import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import Header from "../components/Header";

export const metadata = {
  title: "Admin Panel",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div
        style={{ display: "flex", minHeight: "100vh" }}
        className="admin-container"
      >
        {/* Sidebar */}
        <AdminSidebar />
        {/* Main Content */}
        <main style={{ flex: 1, padding: "20px" }}>{children}</main>
      </div>
    </>
  );
}
