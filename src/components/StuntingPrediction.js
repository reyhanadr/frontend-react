import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card, Spinner, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import id from "date-fns/locale/id";
import SideBidan from "./SideBidan";

const STUNTING_THRESHOLD = -2;
const API_BASE_URL = "http://192.168.43.36:5000";

const stuntingRecommendations = [
  "Memberikan ASI eksklusif hingga bayi berusia 6 bulan",
  "Memberikan MPASI bergizi dan kaya protein hewani untuk bayi >6 bulan",
  "Memantau perkembangan anak dan membawa ke posyandu secara berkala",
  "Mengonsumsi rutin Tablet Tambah Darah (TTD)",
  "Melakukan imunisasi rutin",
  "Memantau tumbuh kembang anak",
  "Menerapkan perilaku hidup bersih dan sehat",
  "Memakai jamban sehat",
  "Konsultasi dengan dokter atau ahli gizi",
  "Pertahankan gizi yang baik",
];

const StuntingPrediction = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isFetchingAlatData, setIsFetchingAlatData] = useState(false);
  const [alatDataError, setAlatDataError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= tokenData.exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    fetchAnakData();
    fetchPredictionHistory();
    fetchLatestAlatData();
  }, [navigate]);

  const fetchAnakData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/anak/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnakList(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data anak");
    }
  };

  const fetchPredictionHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stunting/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHistoryData(response.data.data || []);
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    }
  };

  const fetchLatestAlatData = async () => {
    setIsFetchingAlatData(true);
    setAlatDataError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/stunting/alat/latest`);
      const { tinggi_badan, berat_badan } = response.data.data;
      
      if (tinggi_badan && berat_badan) {
        setFormData(prev => ({
          ...prev,
          tinggi_badan: tinggi_badan.toString(),
          berat_badan: berat_badan.toString()
        }));
      } else {
        setAlatDataError("Data dari alat tidak lengkap");
      }
    } catch (err) {
      console.error("Gagal mengambil data alat:", err);
      setAlatDataError("Gagal mengambil data dari alat");
    } finally {
      setIsFetchingAlatData(false);
    }
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
        jenis_kelamin: anak.jenis_kelamin,
      });
    } else {
      setFormData({
        ...formData,
        id_anak: "",
        nama_anak: selectedNamaAnak,
        nik: "",
        nama_orang_tua: "",
        jenis_kelamin: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPredictionResult(null);
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        umur: parseFloat(formData.umur),
        tinggi_badan: parseFloat(formData.tinggi_badan),
        berat_badan: parseFloat(formData.berat_badan),
      };

      const response = await axios.post(
        `${API_BASE_URL}/stunting/predict`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPredictionResult(response.data.data);
      fetchPredictionHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat memprediksi");
    } finally {
      setIsLoading(false);
    }
  };

  const getStuntingStatus = (zScore) => {
    const isStunting = zScore < STUNTING_THRESHOLD;
    return {
      status: isStunting ? "Stunting" : "Tidak Stunting",
      variant: isStunting ? "danger" : "success",
      textClass: isStunting ? "text-danger" : "text-success",
      badge: isStunting ? (
        <Badge bg="danger">Stunting</Badge>
      ) : (
        <Badge bg="success">Tidak Stunting</Badge>
      ),
    };
  };

  return (
    <div className="d-flex">
      <SideBidan />
      <Container className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Prediksi Stunting</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {alatDataError && <Alert variant="warning">{alatDataError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pilih Anak</Form.Label>
                    <Form.Select
                      name="nama_anak"
                      value={formData.nama_anak}
                      onChange={handleNamaAnakChange}
                      required
                    >
                      <option value="">Pilih Nama Anak</option>
                      {anakList.map((anak) => (
                        <option key={anak.id} value={anak.nama_anak}>
                          {anak.nama_anak}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>NIK</Form.Label>
                    <Form.Control type="text" value={formData.nik} readOnly />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nama Orang Tua</Form.Label>
                    <Form.Control type="text" value={formData.nama_orang_tua} readOnly />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Jenis Kelamin</Form.Label>
                    <Form.Select
  name="jenis_kelamin"
  value={formData.jenis_kelamin}
  onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
  required
>
  <option value="">Pilih Jenis Kelamin</option>
  <option value="1">Laki-laki</option>
  <option value="2">Perempuan</option>
</Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Umur (bulan)</Form.Label>
                    <Form.Control
                      type="number"
                      name="umur"
                      value={formData.umur}
                      onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                      min="0"
                      max="60"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tinggi Badan (cm)</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        name="tinggi_badan"
                        value={formData.tinggi_badan}
                        readOnly
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={fetchLatestAlatData}
                        disabled={isFetchingAlatData}
                        className="ms-2"
                      >
                        {isFetchingAlatData ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Refresh"
                        )}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Berat Badan (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      name="berat_badan"
                      value={formData.berat_badan}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-3">
      
                <Button variant="primary" type="submit" disabled={isLoading || isFetchingAlatData}>
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Memproses...</span>
                    </>
                  ) : (
                    "Prediksi"
                  )}
                </Button>
              </div>
            </Form>

            {predictionResult && (
              <Alert variant={getStuntingStatus(predictionResult.z_score).variant} className="mt-4">
                <h5>Anak {formData.nama_anak} terdeteksi{" "}
                  {getStuntingStatus(predictionResult.z_score).status} dengan Z-score: {predictionResult.z_score.toFixed(2)}
                </h5>
                <div>{getStuntingStatus(predictionResult.z_score).badge}</div>
                <ul>
                  {stuntingRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default StuntingPrediction;