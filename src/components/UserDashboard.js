// 📂 /src/components/BidanDashboard.js
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideUser from "./SideUser";
import { motion } from "framer-motion";
import "../App.css"; // File CSS untuk animasi tambahan

const UserDashboard = () => {
  useEffect(() => {
    document.title = "Dashboard User - Aplikasi Bidan";
  }, []);

  return (
    <div className="vh-100 d-flex flex-column">
      <Navbar />
      <div className="d-flex flex-grow-1">
        {/* 🔹 Sidebar Tetap Ada */}
        <SideUser />
        
        {/* 🔹 Halaman Utama dengan Animasi */}
        <div className="flex-grow-1 p-4 dashboard-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="welcome-container"
          >
            <motion.h1 
              className="welcome-title gradient-text"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Selamat Datang di Dashboard User
            </motion.h1>
            
            <motion.p
              className="welcome-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Anda dapat mengelola semua fitur aplikasi dari sini.
            </motion.p>
            
            <motion.div
              className="welcome-decoration"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;