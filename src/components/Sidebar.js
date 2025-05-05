import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-dark text-white vh-100 p-3 ${isOpen ? "w-250px" : "w-80px"}`} style={{ transition: "width 0.3s" }}>
      <Button variant="light" size="sm" className="mb-3" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "◀" : "▶"}
      </Button>
      {isOpen && <h4 className="text-center">Menu</h4>}
      <Nav className="flex-column">
        {/* Menu untuk semua role */}
        <Nav.Link className="text-white" onClick={() => navigate("/")}>
          📊 {isOpen && "Dashboard"}
        </Nav.Link>

        {/* Menu untuk User */}
        {role === "user" && (
          <>
            <Nav.Link className="text-white" onClick={() => navigate("/StuntingUser")}>
              🔍 {isOpen && "Prediksi Stunting"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/IbuPrediction")}>
              🔍 {isOpen && "Prediksi Calon Ibu"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/StuntingHistory")}>
              📄 {isOpen && "Data Hasil Prediksi"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/IbuHistory")}>
              📄 {isOpen && "Riwayat Prediksi Calon Ibu"}
            </Nav.Link>
          </>
        )}

        {/* Menu untuk Bidan */}
        {role === "bidan" && (
          <>
            <Nav.Link className="text-white" onClick={() => navigate("/AnakList")}>
              📊 {isOpen && "Daftar Anak"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/StuntingPrediction")}>
              🔍 {isOpen && "Prediksi Stunting"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/StuntingHistory")}>
              📄 {isOpen && "Data Hasil Prediksi"}
            </Nav.Link>
          </>
        )}

        {/* Menu untuk Admin */}
        {role === "admin" && (
          <>
            <Nav.Link className="text-white" onClick={() => navigate("/DaftarAkun")}>
              🔍 {isOpen && "Daftar Akun"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/KelolaMpasi")}>
              🔍 {isOpen && "Kelola MPASI"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/StuntingHistory")}>
              📄 {isOpen && "Riwayat Prediksi Stunting"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/IbuHistory")}>
              📄 {isOpen && "Riwayat Prediksi Calon Ibu"}
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => navigate("/AnakList")}>
              📄 {isOpen && "Daftar Anak"}
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;