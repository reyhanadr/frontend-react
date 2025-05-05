import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username || !password) {
      setError("⚠️ Username dan password harus diisi!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Simpan token JWT
        localStorage.setItem("role", data.role);   // Simpan role user
        setSuccess(true);

        setTimeout(() => {
          // 🔹 Redirect berdasarkan role
          if (data.role === "bidan") {
            navigate("/BidanDashboard");
          } else if (data.role === "admin") {
            navigate("/AdminDashboard");
          } else {
            navigate("/UserDashboard");
          }
        }, 2000);
      } else {
        setError(`❌ ${data.message || "Login gagal! Periksa kembali username dan password."}`);
      }
    } catch (error) {
      setError("⚠️ Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  return (
    <>
      <Navbar />
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card style={{ width: "25rem", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
          <Card.Body>
            <h3 className="text-center mb-3">🔐 Login</h3>

            {success && (
              <Alert variant="success">
                <Alert.Heading>🎉 Login Berhasil!</Alert.Heading>
                <p>Selamat datang! Anda akan dialihkan ke Dashboard dalam beberapa detik.</p>
              </Alert>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
            <p className="text-center mt-3">
              Belum punya akun? <Link to="/register">Daftar</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
