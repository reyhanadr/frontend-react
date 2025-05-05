import React, { useEffect, useState } from "react";
import { Table, Container, Navbar, Alert, Button, Modal } from "react-bootstrap";
import Sidebar from "./Sidebar"; 
import jsPDF from "jspdf";
import "jspdf-autotable";

const IbuHistory = () => {
  const [prediksiList, setPrediksiList] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    const fetchPrediksi = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/ibu/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        console.log("Data fetched:", data);

        if (response.ok) {
          setPrediksiList(data.predictions || data.data || []);
        } else {
          setError(data.error || "Gagal mengambil data.");
        }
      } catch (error) {
        console.error("Gagal mengambil data prediksi:", error);
        setError("Terjadi kesalahan saat mengambil data.");
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setRole(data.role);
      } catch (error) {
        console.error("Gagal mengambil role pengguna:", error);
      }
    };

    fetchPrediksi();
    fetchUserRole();
  }, []);

  const handleDeleteClick = (prediction) => {
    setSelectedPrediction(prediction);
    setShowDeleteModal(true);
  };

  const handleDeleteIbu = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/ibu/hapus/${selectedPrediction.id_prediction}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        setPrediksiList(prediksiList.filter((item) => item.id_prediction !== selectedPrediction.id_prediction));
        setShowDeleteModal(false);
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Gagal menghapus data prediksi:", error);
      setError("Terjadi kesalahan saat menghapus data.");
    }
  };

  const getBMIStatus = (berat, tinggi) => {
    if (!berat || !tinggi) return "N/A";
    const tinggiMeter = tinggi / 100;
    const bmi = berat / (tinggiMeter * tinggiMeter);

    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obesitas";
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Hasil Prediksi Calon Ibu", 105, 15, null, null, "center");

    const date = new Date().toLocaleDateString("id-ID");
    doc.setFontSize(11);
    doc.text(`Tanggal Cetak: ${date}`, 105, 25, null, null, "center");

    const tableData = prediksiList.map((item, index) => [
      index + 1,
      item.username,
      item.usia,
      item.berat_badan || "N/A",
      item.tinggi_badan || "N/A",
      getBMIStatus(item.berat_badan, item.tinggi_badan),
      item.hasil_prediksi,
      item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "N/A",
    ]);

    doc.autoTable({
      head: [["No", "Username", "Usia", "BB (kg)", "TB (cm)", "BMI", "Hasil", "Tanggal"]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`laporan_prediksi_calon_ibu_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="d-flex">
      <Sidebar role={role} />
      <Container className="mt-4">
        <Navbar bg="light" expand="lg" className="mb-3 p-3 d-flex justify-content-between">
          <Navbar.Brand>Riwayat Prediksi Calon Ibu</Navbar.Brand>
          <Button variant="primary" onClick={exportToPDF}>
            Export PDF
          </Button>
        </Navbar>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Usia</th>
              <th>BB (kg)</th>
              <th>TB (cm)</th>
              <th>Status BMI</th>
              <th>Hasil Prediksi</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prediksiList.length > 0 ? (
              prediksiList.map((item, index) => (
                <tr key={item.id_prediction}>
                  <td>{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.usia}</td>
                  <td>{item.berat_badan || "N/A"}</td>
                  <td>{item.tinggi_badan || "N/A"}</td>
                  <td>{getBMIStatus(item.berat_badan, item.tinggi_badan)}</td>
                  <td>{item.hasil_prediksi}</td>
                  <td>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("id-ID")
                      : "Tanggal tidak tersedia"}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  Belum ada data prediksi
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Apakah Anda yakin ingin menghapus prediksi dari{" "}
            <strong>{selectedPrediction?.username}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDeleteIbu}>
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default IbuHistory;
