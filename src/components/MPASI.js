import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button, Modal } from "react-bootstrap";
import Navbar from "./Navbar"; // 🛠️ Import Navbar

const MPASI = () => {
  const [mpasiList, setMpasiList] = useState([]);
  const [filteredMpasi, setFilteredMpasi] = useState([]);
  const [selectedMpasi, setSelectedMpasi] = useState(null); // Untuk modal baca selengkapnya
  const [usiaFilter, setUsiaFilter] = useState(""); // Filter usia

  useEffect(() => {
    const fetchMPASI = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/mpasi/list");
        const data = await response.json();
        if (Array.isArray(data)) {
          setMpasiList(data);
          setFilteredMpasi(data);
        } else {
          setMpasiList([]);
          setFilteredMpasi([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data MPASI:", error);
      }
    };
    fetchMPASI();
  }, []);

  // 🔍 Filter berdasarkan usia minimum
  const handleFilter = () => {
    if (!usiaFilter) {
      setFilteredMpasi(mpasiList);
    } else {
      const filtered = mpasiList.filter((item) => item.usia_minimum <= parseInt(usiaFilter));
      setFilteredMpasi(filtered);
    }
  };

  return (
    <>
      {/* 🏠 Navbar */}
      <Navbar />

      <Container className="mt-4">
        <h2 className="text-center mb-4">Rekomendasi MPASI</h2>

        {/* 🔍 Filter Usia */}
        <Form className="mb-4 d-flex justify-content-center">
          <Form.Control
            type="number"
            placeholder="Masukkan usia bayi (bulan)..."
            className="w-25 me-2"
            value={usiaFilter}
            onChange={(e) => setUsiaFilter(e.target.value)}
          />
          <Button variant="primary" onClick={handleFilter}>Filter</Button>
        </Form>

        {/* 🏷️ Menampilkan Card MPASI */}
        <Row>
          {filteredMpasi.length > 0 ? (
            filteredMpasi.map((item) => (
              <Col md={4} className="mb-4" key={item.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{item.nama_makanan}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Usia Minimum: {item.usia_minimum} bulan
                    </Card.Subtitle>
                    <Card.Text style={{ whiteSpace: "pre-line" }}> {/* Tambahkan style untuk baris baru */}
                      {item.deskripsi.length > 100
                        ? `${item.deskripsi.substring(0, 100)}...`
                        : item.deskripsi}
                    </Card.Text>
                    {item.deskripsi.length > 100 && (
                      <Button variant="link" onClick={() => setSelectedMpasi(item)}>
                        Baca Selengkapnya
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">Tidak ada rekomendasi MPASI.</p>
          )}
        </Row>

        {/* 📝 Modal untuk Baca Selengkapnya */}
        {selectedMpasi && (
          <Modal show={true} onHide={() => setSelectedMpasi(null)}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMpasi.nama_makanan}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ whiteSpace: "pre-line" }}>{selectedMpasi.deskripsi}</Modal.Body> {/* Tambahkan style untuk baris baru */}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedMpasi(null)}>
                Tutup
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </>
  );
};

export default MPASI;