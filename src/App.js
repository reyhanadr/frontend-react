import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import StuntingPrediction from "./components/StuntingPrediction";
import BidanDashboard from "./components/BidanDashboard";
import AnakList from "./components/AnakList";
import SideBidan from "./components/SideBidan";
import StuntingHistory from "./components/StuntingHistory";
import SideUser from "./components/SideUser";
import UserDashboard from "./components/UserDashboard";
import IbuPrediction from "./components/IbuPrediction";
import Mpasi from "./components/MPASI";
import IbuHistory from "./components/IbuHistory";
import StuntingPage from "./components/StuntingUser";
import AdminDashboard from "./components/AdminDashboard";
import UserList from "./components/DaftarAkun";
import MpasiList from "./components/KelolaMpasi";
import About from "./components/About";

function App() {
  return (
    <BrowserRouter basename="/growtrack">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/StuntingPrediction" element={<StuntingPrediction />} />
        <Route path="/BidanDashboard" element={<BidanDashboard />} />
        <Route path="/AnakList" element={<AnakList />} />
        <Route path="/SideBidan" element={<SideBidan />} />
        <Route path="/StuntingHistory" element={<StuntingHistory />} />
        <Route path="/MPASI" element={<Mpasi />} />
        <Route path="/SideUser" element={<SideUser />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/IbuPrediction" element={<IbuPrediction />} />
        <Route path="/IbuHistory" element={<IbuHistory />} />
        <Route path="/StuntingUser" element={<StuntingPage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/DaftarAkun" element={<UserList />} />
        <Route path="/KelolaMpasi" element={<MpasiList />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
