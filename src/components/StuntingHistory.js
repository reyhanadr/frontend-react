import React, { useEffect, useState } from "react";
import { Table, Container, Navbar, Form, FormControl, Button, Dropdown } from "react-bootstrap";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const HasilPrediksi = () => {
  const [prediksiList, setPrediksiList] = useState([]);
  const [searchNIK, setSearchNIK] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    const fetchPrediksi = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/stunting/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setPrediksiList(data.history || []);
      } catch (error) {
        console.error("Gagal mengambil data prediksi:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setRole(data.role);
        setUsername(data.username);
      } catch (error) {
        console.error("Gagal mengambil role pengguna:", error);
      }
    };

    fetchPrediksi();
    fetchUserRole();
  }, []);

  const filteredPrediksi = prediksiList.filter((item) => {
    const nikMatch = item.nik.toLowerCase().includes(searchNIK.toLowerCase());
    const statusMatch =
      statusFilter === "Semua" ||
      (statusFilter === "Stunting" && item.hasil_prediksi === "Stunting") ||
      (statusFilter === "Tidak Stunting" && item.hasil_prediksi === "Tidak Stunting");

    return nikMatch && statusMatch;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Hasil Prediksi Stunting", 105, 15, null, null, 'center');

    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Filter: ${statusFilter} | NIK: ${searchNIK || 'Semua'}`, 105, 25, null, null, 'center');
    // doc.text(`Tanggal Cetak: ${date}`, 105, 35, null, null, 'center');

    const tableData = filteredPrediksi.map((item, index) => [
      index + 1,
      item.nama_anak,
      item.nik,
      item.nama_ortu || "-",
      item.jenis_kelamin,
      item.umur,
      item.berat_badan,
      item.tinggi_badan,
      item.z_score.toFixed(2),
      item.hasil_prediksi
    ]);

    doc.autoTable({
      head: [
        ['No', 'Nama Anak', 'NIK', 'Nama Orang Tua', 'Jenis Kelamin', 'Umur', 'BB', 'TB', 'Z-Score', 'Status']
      ],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    const y = doc.lastAutoTable.finalY + 20;
    doc.text(`Tegal, ${date}`, 145, y);
    doc.text("Dibuat oleh,", 145, y + 7);
    doc.text(`(${username})`, 145, y + 30);


    doc.save(`laporan_prediksi_stunting_${date}.pdf`);
  };

  return (
    <div className="d-flex">
      <Sidebar role={role} />
      <Container className="mt-4">
        <Navbar bg="light" expand="lg" className="mb-3 p-3 d-flex justify-content-between">
          <Navbar.Brand>Hasil Prediksi Stunting</Navbar.Brand>
          <div className="d-flex align-items-center">
            <Dropdown className="me-2">
              <Dropdown.Toggle variant="secondary" id="dropdown-status-filter">
                {statusFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setStatusFilter("Semua")}>Semua</Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter("Stunting")}>Stunting</Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter("Tidak Stunting")}>Tidak Stunting</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form className="me-2">
              <FormControl
                type="text"
                placeholder="Cari berdasarkan NIK..."
                value={searchNIK}
                onChange={(e) => setSearchNIK(e.target.value)}
              />
            </Form>

            <Button variant="success" onClick={exportToPDF}>
              Export PDF
            </Button>
          </div>
        </Navbar>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Anak</th>
              <th>NIK</th>
              <th>Nama Orang Tua</th>
              <th>Jenis Kelamin</th>
              <th>Umur</th>
              <th>BB</th>
              <th>TB</th>
              <th>Z-Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrediksi.length > 0 ? (
              filteredPrediksi.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.nama_anak}</td>
                  <td>{item.nik}</td>
                  <td>{item.nama_ortu || "-"}</td>
                  <td>{item.jenis_kelamin}</td>
                  <td>{item.umur}</td>
                  <td>{item.berat_badan}</td>
                  <td>{item.tinggi_badan}</td>
                  <td>{item.z_score.toFixed(2)}</td>
                  <td className={item.hasil_prediksi === "Stunting" ? "text-danger fw-bold" : "text-success fw-bold"}>
                    {item.hasil_prediksi}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  {searchNIK || statusFilter !== "Semua"
                    ? "Data tidak ditemukan dengan filter yang dipilih"
                    : "Data tidak ditemukan"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default HasilPrediksi;
