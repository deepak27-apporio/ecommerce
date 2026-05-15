"use client"

import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { withRole } from "../hocs/withRole";


function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="admin-container">
      <AdminSidebar />
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}

export default withRole(AdminLayout, ["admin"]);