import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, ProgressBar, Alert, Card, Navbar, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SideUser from "./SideUser";

const StuntingPage = () => {
  const [formData, setFormData] = useState({
    id_anak: "",
    nik: "",
    nama_anak: "",
    nama_orang_tua: "",
    jenis_kelamin: "",
    umur: "",
    tinggi_badan: "",
    berat_badan: "",
  });

  const [anakList, setAnakList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnak, setNewAnak] = useState({ nik: "", nama_anak: "", nama_orang_tua: "" });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const STUNTING_THRESHOLD = -2;
  const stuntingRecommendations = [
    "Memberikan ASI eksklusif hingga bayi berusia 6 bulan",
    "Memberikan MPASI yang bergizi dan kaya protein hewani untuk bayi yang berusia di atas 6 bulan",
    "Memantau perkembangan anak dan membawa ke posyandu secara berkala",
    "Mengonsumsi secara rutin Tablet Tambah Darah (TTD)",
    "Melakukan imunisasi rutin",
    "Memantau tumbuh kembang anak",
    "Menerapkan perilaku hidup bersih dan sehat",
    "Memakai jamban sehat",
    "Konsultasikan dengan dokter atau ahli gizi",
    "Pertahankan gizi yang baik"
  ];
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= tokenData.exp * 1000) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
      const fetchAnakData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/anak/list", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          
          if (!response.ok) {
            throw new Error("Gagal mengambil data anak");
          }
          
          const data = await response.json();
          setAnakList(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
          console.error("Error fetching child data:", error);
          setErrorMessage(error.message);
          setAnakList([]);
        }
      };
      
      fetchAnakData();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

  const handleNamaAnakChange = (e) => {
    const selectedNamaAnak = e.target.value;
    const anak = anakList.find((a) => a && a.nama_anak === selectedNamaAnak);
    if (anak) {
      setFormData({
        ...formData,
        id_anak: anak.id,
        nama_anak: anak.nama_anak,
        nik: anak.nik,
        nama_orang_tua: anak.nama_orang_tua,
      });
    } else {
      setFormData({
        ...formData,
        id_anak: "",
        nama_anak: selectedNamaAnak,
        nik: "",
        nama_orang_tua: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setApiResponse(null);
    setErrorMessage("");

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 20, 100));
    }, 500);

    try {
      // Prepare request data
      const requestData = {
        ...formData,
        jenis_kelamin: formData.jenis_kelamin === "Laki-laki" ? 1 : 0,
        umur: parseFloat(formData.umur),
        tinggi_badan: parseFloat(formData.tinggi_badan),
        berat_badan: parseFloat(formData.berat_badan),
      };

      console.log("Submitting data:", requestData);

      // API call
      const response = await fetch("http://127.0.0.1:5000/stunting/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });

      // Handle response
      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Prediksi gagal");
      }

      // Process response data
      const responseData = result.data || result;
      
      if (typeof responseData.z_score === 'undefined') {
        throw new Error("Data z_score tidak ditemukan dalam response");
      }

      // Determine status consistently
      const status = responseData.result || 
                    (responseData.z_score < STUNTING_THRESHOLD ? "Stunting" : "Tidak Stunting");

      setApiResponse({
        z_score: parseFloat(responseData.z_score),
        result: status,
        rawData: responseData // Keep original data for debugging
      });

    } catch (error) {
      console.error("Prediction error:", error);
      setErrorMessage(error.message || "Terjadi kesalahan saat memproses prediksi");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setProgress(100);
    }
  };

  const getStuntingStatus = (zScore) => {
    return {
      status: zScore < STUNTING_THRESHOLD ? "Stunting" : "Tidak Stunting",
      variant: zScore < STUNTING_THRESHOLD ? "danger" : "success",
      textClass: zScore < STUNTING_THRESHOLD ? "text-danger" : "text-success"
    };
  };

  const handleAddAnak = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/anak/tambah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAnak),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setShowSuccessAlert(true); // Tampilkan pesan sukses
        setShowAddModal(false); // Tutup modal tambah anak
        setShowPopup(false); // Tutup pop-up informasi
        setAnakList((prevAnakList) => [...prevAnakList, data.data]); // Tambahkan anak ke daftar
      } else {
        console.error("Error adding anak:", data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding anak:", error);
    }
  };

  return (
    <div className="d-flex">
      <SideUser />
      <Container className="mt-4">
        <Navbar bg="light" expand="lg" className="mb-3">
          <Navbar.Brand href="#">Sistem Prediksi Stunting</Navbar.Brand>
        </Navbar>
        <Card className="shadow-lg p-4 border-0">
          <h2 className="text-center mb-4 text-primary">Prediksi Stunting</h2>

          {/* Pesan sukses menambahkan anak */}
          {showSuccessAlert && (
            <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
              Anak berhasil ditambahkan!
            </Alert>
          )}

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Anak</Form.Label>
                  <Form.Select name="nama_anak" value={formData.nama_anak} onChange={handleNamaAnakChange} required>
                    <option value="">Pilih Nama Anak</option>
                    {anakList.map((anak) => (
                      anak ? (
                        <option key={anak.id} value={anak.nama_anak}>{anak.nama_anak}</option>
                      ) : null
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NIK</Form.Label>
                  <Form.Control type="text" name="nik" value={formData.nik} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Orang Tua</Form.Label>
                  <Form.Control type="text" name="nama_orang_tua" value={formData.nama_orang_tua} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Kelamin</Form.Label>
                  <Form.Select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} required>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Umur (bulan)</Form.Label>
                  <Form.Control type="number" name="umur" value={formData.umur} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tinggi Badan (cm)</Form.Label>
                  <Form.Control type="number" step="0.1" name="tinggi_badan" value={formData.tinggi_badan} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Berat Badan (kg)</Form.Label>
                  <Form.Control type="number" step="0.1" name="berat_badan" value={formData.berat_badan} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            {loading && <ProgressBar animated now={progress} label={`${progress}%`} className="mb-3" />}

            <Button variant="primary" type="submit" disabled={loading}>{loading ? "Memprediksi..." : "Prediksi"}</Button>
          </Form>

          {apiResponse && (
            <div className="mt-4">
              <Alert variant={getStuntingStatus(apiResponse.z_score).variant}>
                          <h4>Hasil Prediksi</h4>
                          <p>
                            <strong>Z-Score:</strong> {apiResponse.z_score.toFixed(2)}
                            <br />
                            <strong>Status:</strong>{" "}
                            <span className={`fw-bold ${getStuntingStatus(apiResponse.z_score).textClass}`}>
                              {apiResponse.result}
                            </span>
                            <br />
                            <small className="text-muted">
                              (Berdasarkan cutoff Z-Score &lt; {STUNTING_THRESHOLD})
                            </small>
                          </p>
                          
                          <hr />
                          
                          <h5>Detail Input</h5>
                          <p><strong>Nama Anak:</strong> {formData.nama_anak}</p>
                          <p><strong>Umur:</strong> {formData.umur} bulan</p>
                          <p><strong>Tinggi Badan:</strong> {formData.tinggi_badan} cm</p>
                          <p><strong>Berat Badan:</strong> {formData.berat_badan} kg</p>
                        </Alert>
          
                        {apiResponse.result === "Stunting" && (
                          <Card className="mt-3 border-warning">
                            <Card.Header className="bg-warning text-dark">
                              <h5 className="mb-0">Rekomendasi Tindak Lanjut</h5>
                            </Card.Header>
                            <Card.Body>
                              <ol className="mb-0">
                                {stuntingRecommendations.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ol>
                            </Card.Body>
                          </Card>
                        )}
                      </div>
                    )}
        </Card>
      </Container>

      {showPopup && (
        <Modal show onHide={() => setShowPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Informasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Apakah Anda sudah mendaftarkan anak di posyandu?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPopup(false)}>Sudah</Button>
            <Button variant="primary" onClick={() => { setShowPopup(false); setShowAddModal(true); }}>Tambah Anak</Button>
          </Modal.Footer>
        </Modal>
      )}

      {showAddModal && (
        <Modal show onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Anak</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddAnak}>
              <Form.Group className="mb-3">
                <Form.Label>NIK</Form.Label>
                <Form.Control type="text" value={newAnak.nik} onChange={(e) => setNewAnak({ ...newAnak, nik: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nama Anak</Form.Label>
                <Form.Control type="text" value={newAnak.nama_anak} onChange={(e) => setNewAnak({ ...newAnak, nama_anak: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nama Orang Tua</Form.Label>
                <Form.Control type="text" value={newAnak.nama_orang_tua} onChange={(e) => setNewAnak({ ...newAnak, nama_orang_tua: e.target.value })} required />
              </Form.Group>
              {loading ? <Button variant="primary" disabled>Loading...</Button> : <Button variant="primary" type="submit">Tambah Anak</Button>}
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default StuntingPage;