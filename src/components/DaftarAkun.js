import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Row, Col } from "react-bootstrap";
import SideAdmin from "./SideAdmin";

const UserList = () => {
  const [userList, setUserList] = useState([]); // Simpan data user
  const [error, setError] = useState(null); // Simpan error

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:5000/auth/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserList(response.data.data); // Mengupdate state userList dengan data
      } catch (err) {
        setError("Gagal mengambil data akun!"); // Menangani error jika gagal
      }
    };

    fetchUserList(); // Panggil fungsi saat komponen pertama kali dimuat
  }, []); // Dependensi kosong berarti hanya dipanggil sekali setelah komponen dimuat

  return (
    <div className="anak-list-container">
      <Row className="g-0">
        <Col md={2} className="sidebar-container">
          <SideAdmin />
        </Col>

        <Col md={10} className="content-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Daftar Akun</h2>
          </div>
          {error && <div className="alert alert-danger">{error}</div>} {/* Tampilkan error jika ada */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {userList.length > 0 ? (
                userList.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default UserList;
