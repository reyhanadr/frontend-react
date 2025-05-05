import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert, Row, Col } from "react-bootstrap";
import SideAdmin from "./SideAdmin";

const MpasiList = () => {
  const [mpasiList, setMpasiList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMpasi, setNewMpasi] = useState({ nama_makanan: "", usia_minimum: "", deskripsi: "" });
  const [editMpasi, setEditMpasi] = useState({ nama_makanan: "", usia_minimum: "", deskripsi: "" });
  const [deleteMpasiId, setDeleteMpasiId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Ambil data MPASI dari backend
  const fetchMpasiList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/mpasi/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setMpasiList(response.data);
      } else {
        setError("Data MPASI tidak ditemukan!");
      }
    } catch (err) {
      setError("Gagal mengambil data MPASI!");
      console.error("Error fetching MPASI list:", err);
    }
  };

  useEffect(() => {
    fetchMpasiList();
  }, []);

  // Fungsi untuk menambahkan MPASI
  const handleAddMpasi = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:5000/mpasi/add",
        newMpasi,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddModal(false);
      setSuccess("MPASI berhasil ditambahkan!");
      setNewMpasi({ nama_makanan: "", usia_minimum: "", deskripsi: "" });
      fetchMpasiList();
    } catch (err) {
      setError("Gagal menambahkan MPASI!");
      console.error("Error adding MPASI:", err);
    }
  };

  // Fungsi untuk mengedit MPASI
  const handleEditMpasi = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:5000/mpasi/edit/${editMpasi.id}`,
        editMpasi,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditModal(false);
      setSuccess("Data MPASI berhasil diperbarui!");
      fetchMpasiList();
    } catch (err) {
      setError("Gagal mengupdate data MPASI!");
      console.error("Error updating MPASI:", err);
    }
  };

  // Fungsi untuk menghapus MPASI
  const handleDeleteMpasi = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:5000/mpasi/delete/${deleteMpasiId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowDeleteModal(false);
      setSuccess("Data MPASI berhasil dihapus!");
      fetchMpasiList();
    } catch (err) {
      setError("Gagal menghapus data MPASI!");
      console.error("Error deleting MPASI:", err);
    }
  };

  return (
    <div className="mpasi-list-container">
      <Row className="g-0">
        <Col md={2} className="sidebar-container">
          <SideAdmin />
        </Col>

        <Col md={10} className="content-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Daftar MPASI</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              + Tambah Menu
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Makanan</th>
                <th>Usia Minimum</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mpasiList.length > 0 ? (
                mpasiList.map((mpasi, index) => (
                  <tr key={mpasi.id}>
                    <td>{index + 1}</td>
                    <td>{mpasi.nama_makanan}</td>
                    <td>{mpasi.usia_minimum}</td>
                    <td style={{ whiteSpace: "pre-line" }}>{mpasi.deskripsi}</td> {/* Tampilkan deskripsi dengan baris baru */}
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setEditMpasi(mpasi);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setDeleteMpasiId(mpasi.id);
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
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal Tambah MPASI */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah MPASI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMpasi}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Makanan</Form.Label>
              <Form.Control
                type="text"
                value={newMpasi.nama_makanan}
                onChange={(e) =>
                  setNewMpasi({ ...newMpasi, nama_makanan: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Usia Minimum</Form.Label>
              <Form.Control
                type="text"
                value={newMpasi.usia_minimum}
                onChange={(e) =>
                  setNewMpasi({ ...newMpasi, usia_minimum: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newMpasi.deskripsi}
                onChange={(e) =>
                  setNewMpasi({ ...newMpasi, deskripsi: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Edit MPASI */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit MPASI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditMpasi}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Makanan</Form.Label>
              <Form.Control
                type="text"
                value={editMpasi?.nama_makanan || ""}
                onChange={(e) =>
                  setEditMpasi({ ...editMpasi, nama_makanan: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Usia Minimum</Form.Label>
              <Form.Control
                type="text"
                value={editMpasi?.usia_minimum || ""}
                onChange={(e) =>
                  setEditMpasi({ ...editMpasi, usia_minimum: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editMpasi?.deskripsi || ""}
                onChange={(e) =>
                  setEditMpasi({ ...editMpasi, deskripsi: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan Perubahan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Hapus MPASI */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus MPASI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus MPASI ini?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteMpasi}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MpasiList;