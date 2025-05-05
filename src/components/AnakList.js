import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert, Row, Col, FormControl } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Import Sidebar dinamis

const AnakList = () => {
  const [anakList, setAnakList] = useState([]);
  const [bidanId, setBidanId] = useState(null);
  const [bidanName, setBidanName] = useState("");
  const [searchNIK, setSearchNIK] = useState(""); // 🔍 State untuk input pencarian
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newAnak, setNewAnak] = useState({ nik: "", nama_anak: "", nama_orang_tua: "" });
  const [editAnak, setEditAnak] = useState(null);
  const [deleteAnakId, setDeleteAnakId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState(""); // State untuk role pengguna

  useEffect(() => {
    fetchBidanData();
  }, []);

  const fetchBidanData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBidanId(response.data.user_id);
      setBidanName(response.data.nama);
      setRole(response.data.role); // Ambil role pengguna
      fetchAnak(response.data.user_id);
    } catch (err) {
      setError("Gagal mengambil data bidan!");
    }
  };

  const fetchAnak = async (bidanId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://127.0.0.1:5000/anak/list?bidan_id=${bidanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnakList(response.data.data);
    } catch (err) {
      setError("Gagal mengambil data anak!");
    }
  };

  const handleAddAnak = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:5000/anak/tambah",
        { ...newAnak, bidan_id: bidanId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddModal(false);
      setSuccess("Anak berhasil ditambahkan!");
      setNewAnak({ nik: "", nama_anak: "", nama_orang_tua: "" }); // Reset form
      fetchAnak(bidanId);
    } catch (err) {
      setError("Gagal menambahkan anak!");
    }
  };

  const handleEditAnak = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:5000/anak/edit/${editAnak.id}`,
        editAnak,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditModal(false);
      setSuccess("Data anak berhasil diperbarui!");
      fetchAnak(bidanId);
    } catch (err) {
      setError("Gagal mengupdate data anak!");
    }
  };

  const handleDeleteAnak = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:5000/anak/hapus/${deleteAnakId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteModal(false);
      setSuccess("Data anak berhasil dihapus!");
      fetchAnak(bidanId);
    } catch (err) {
      setError("Gagal menghapus data anak!");
    }
  };

  // 🔍 Filter data berdasarkan NIK yang diketik
  const filteredAnakList = anakList.filter((anak) =>
    anak.nik.toLowerCase().includes(searchNIK.toLowerCase())
  );

  return (
    <div className="anak-list-container">
      <Row className="g-0">
        <Col md={2} className="sidebar-container">
          <Sidebar role={role} bidanName={bidanName} /> {/* Gunakan Sidebar dinamis */}
        </Col>

        <Col md={10} className="content-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Daftar Anak</h2>
            {/* 🔍 Input pencarian */}
            <Form className="d-flex">
              <FormControl
                type="text"
                placeholder="Cari berdasarkan NIK..."
                className="me-2"
                value={searchNIK}
                onChange={(e) => setSearchNIK(e.target.value)}
              />
            </Form>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              + Tambah Anak
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>NIK</th>
                <th>Nama Anak</th>
                <th>Nama Orang Tua</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnakList.length > 0 ? (
                filteredAnakList.map((anak, index) => (
                  <tr key={anak.id}>
                    <td>{index + 1}</td>
                    <td>{anak.nik}</td>
                    <td>{anak.nama_anak}</td>
                    <td>{anak.nama_orang_tua}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setEditAnak(anak);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setDeleteAnakId(anak.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {searchNIK ? "NIK tidak ditemukan" : "Tidak ada data"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* ✅ Modal Tambah Anak */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Anak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAnak}>
            <Form.Group className="mb-3">
              <Form.Label>NIK</Form.Label>
              <Form.Control
                type="text"
                value={newAnak.nik}
                onChange={(e) => setNewAnak({ ...newAnak, nik: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Anak</Form.Label>
              <Form.Control
                type="text"
                value={newAnak.nama_anak}
                onChange={(e) => setNewAnak({ ...newAnak, nama_anak: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Orang Tua</Form.Label>
              <Form.Control
                type="text"
                value={newAnak.nama_orang_tua}
                onChange={(e) => setNewAnak({ ...newAnak, nama_orang_tua: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ Modal Edit Anak */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Anak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditAnak}>
            <Form.Group className="mb-3">
              <Form.Label>NIK</Form.Label>
              <Form.Control
                type="text"
                value={editAnak?.nik || ""}
                onChange={(e) => setEditAnak({ ...editAnak, nik: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Anak</Form.Label>
              <Form.Control
                type="text"
                value={editAnak?.nama_anak || ""}
                onChange={(e) => setEditAnak({ ...editAnak, nama_anak: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Orang Tua</Form.Label>
              <Form.Control
                type="text"
                value={editAnak?.nama_orang_tua || ""}
                onChange={(e) => setEditAnak({ ...editAnak, nama_orang_tua: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan Perubahan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ Modal Hapus Anak */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Anak</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus data ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteAnak}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AnakList;