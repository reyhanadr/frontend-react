// 📂 /src/components/Sidebar.js
import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SideBidan = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-dark text-white vh-100 p-3 ${isOpen ? "w-250px" : "w-80px"}`} style={{ transition: "width 0.3s" }}>
      <Button variant="light" size="sm" className="mb-3" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "◀" : "▶"}
      </Button>
      {isOpen && <h4 className="text-center">Menu</h4>}
      <Nav className="flex-column">
        <Nav.Link className="text-white" onClick={() => navigate("/")}>
          📊 {isOpen && "Dashboard"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => navigate("/AnakList")}>
          📊 {isOpen && "Daftar Anak"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => navigate("/StuntingPrediction")}>
          🔍 {isOpen && "Prediksi Stunting"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => navigate("/StuntingHistory")}>
          📄 {isOpen && "Data Hasil Prediksi"}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SideBidan;
