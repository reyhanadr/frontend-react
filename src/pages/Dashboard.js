import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar"; // Import Sidebar dinamis

const Dashboard = () => {
  const [role, setRole] = useState(""); // State untuk role pengguna

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/user/role", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setRole(data.role); // Set role pengguna
      } catch (error) {
        console.error("Gagal mengambil role pengguna:", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div className="vh-100 d-flex flex-column">
      <Navbar />
      <div className="d-flex">
        {/* 🔹 Sidebar Dinamis */}
        <Sidebar role={role} />
        {/* 🔹 Halaman Berubah di Sini */}
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;