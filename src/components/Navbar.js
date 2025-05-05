import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar as BootstrapNavbar, Nav } from "react-bootstrap";
import "../App.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Navbar */}
      <BootstrapNavbar bg="primary" variant="dark" expand="lg">
        <Container style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Kiri: Judul */}
          <div
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            Sistem Informasi Tumbuh Kembang Balita
          </div>

          {/* Kanan: Credit dan Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "white" }}>Politeknik Harapan Bersama</div>
            <img
              src="https://cavendishame.github.io/growtrack/image.png"
              alt="Logo Poltek Harber"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </div>
        </Container>
      </BootstrapNavbar>

      {/* Gambar full layar */}
      <img
        src="https://cavendishame.github.io/growtrack/Picture1.png"
        alt="Prediksi Stunting"
        style={{
          width: "100vw",
          height: "auto",
          display: "block",
          objectFit: "cover",
          margin: 0,
          padding: 0,
        }}
      />

      {/* Tabs Navigasi */}
      <div className="navbar-tabs-container">
        <Nav className="justify-content-center navbar-tabs">
          <Nav.Link
            onClick={() => navigate("/")}
            className={`tab-link ${location.pathname === "/" ? "active-tab" : ""}`}
          >
            Home
          </Nav.Link>
          <Nav.Link
            onClick={() => navigate("/mpasi")}
            className={`tab-link ${location.pathname === "/mpasi" ? "active-tab" : ""}`}
          >
            MPASI
          </Nav.Link>
          {isAuthenticated ? (
            <Nav.Link onClick={handleLogout} className="tab-link">Logout</Nav.Link>
          ) : (
            <Nav.Link
              onClick={() => navigate("/login")}
              className={`tab-link ${location.pathname === "/login" ? "active-tab" : ""}`}
            >
              Login
            </Nav.Link>
          )}
          <Nav.Link
            onClick={() => navigate("/About")}
            className={`tab-link ${location.pathname === "/About" ? "active-tab" : ""}`}
          >
            About
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default CustomNavbar;
