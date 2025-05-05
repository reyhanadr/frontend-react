import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role: user
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
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login"); // Redirect ke login setelah sukses
        }, 2000);
      } else {
        setError(`❌ ${data.message || "Registrasi gagal! Coba lagi."}`);
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
            <h3 className="text-center">📝 Register</h3>

            {success && (
              <Alert variant="success">
                <Alert.Heading>🎉 Registrasi Berhasil!</Alert.Heading>
                <p>Akun Anda berhasil dibuat. Anda akan diarahkan ke halaman login.</p>
              </Alert>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="user">User</option>
                  <option value="bidan">Bidan</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>
            </Form>

            <p className="text-center mt-3">
              Sudah punya akun? <Link to="/login">Login</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Register;
