import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import SideUser from "./SideUser";

const IbuPrediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usia: "",
    tinggi_badan: "",
    berat_badan: "",
    riwayat_gizi: "",
    konsumsi_gizi: "",
    cek_kesehatan: "",
    riwayat_stunting: "",
    pendidikan: "",
    pola_asuh: "",
    ekonomi: "",
  });

  const [result, setResult] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [followUp, setFollowUp] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const calculateBmi = (tinggi, berat) => {
    const tinggiMeter = tinggi / 100;
    const bmiValue = berat / (tinggiMeter * tinggiMeter);
    const roundedBmi = parseFloat(bmiValue.toFixed(1));
    setBmi(roundedBmi);
    
    let category = "";
    if (roundedBmi < 18.5) {
      category = "Kurang";
    } else if (roundedBmi >= 18.5 && roundedBmi <= 24.9) {
      category = "Normal";
    } else {
      category = "Lebih";
    }
    
    setBmiCategory(category);
    return category;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Field ini wajib diisi";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const determineFollowUp = (riskLevel, bmiCat) => {
    let followUpContent;
    
    if (riskLevel === "Rendah") {
      if (bmiCat === "Kurang") {
        followUpContent = (
          <>
            <h5>Tindak Lanjut untuk Risiko Rendah dengan BMI Kurang:</h5>
            <ul>
              <li>Tingkatkan asupan makanan bergizi seimbang</li>
              <li>Konsumsi makanan tinggi protein dan zat besi</li>
              <li>Lakukan pemeriksaan kesehatan rutin</li>
              <li>Ikuti program suplementasi gizi jika diperlukan</li>
            </ul>
          </>
        );
      } else if (bmiCat === "Lebih") {
        followUpContent = (
          <>
            <h5>Tindak Lanjut untuk Risiko Rendah dengan BMI Lebih:</h5>
            <ul>
              <li>Lakukan aktivitas fisik secara teratur</li>
              <li>Kurangi konsumsi makanan tinggi gula dan lemak</li>
              <li>Perbanyak konsumsi sayur dan buah</li>
              <li>Konsultasi dengan ahli gizi untuk diet seimbang</li>
            </ul>
          </>
        );
      } else {
        followUpContent = (
          <>
            <h5>Tindak Lanjut untuk Risiko Rendah:</h5>
            <ul>
              <li>Pertahankan pola makan sehat dan seimbang</li>
              <li>Lakukan pemeriksaan kesehatan rutin</li>
              <li>Ikuti edukasi kesehatan ibu dan anak</li>
              <li>Pantau perkembangan kesehatan secara berkala</li>
            </ul>
          </>
        );
      }
    } else if (riskLevel === "Sedang") {
      followUpContent = (
        <>
          <h5>Tindak Lanjut untuk Risiko Sedang:</h5>
          <ul>
            <li>Konsultasi dengan tenaga kesehatan segera</li>
            <li>Perbaiki pola makan dengan gizi seimbang</li>
            <li>Ikuti program monitoring kesehatan</li>
            <li>Lakukan pemeriksaan laboratorium dasar</li>
          </ul>
        </>
      );
    } else if (riskLevel === "Tinggi") {
      followUpContent = (
        <>
          <h5>Tindak Lanjut untuk Risiko Tinggi:</h5>
          <ul>
            <li>Segera konsultasi dengan dokter atau ahli gizi</li>
            <li>Ikuti program intervensi gizi khusus</li>
            <li>Lakukan pemeriksaan laboratorium lengkap</li>
            <li>Ikuti kelas edukasi pencegahan stunting</li>
            <li>Pantau perkembangan kesehatan secara intensif</li>
          </ul>
        </>
      );
    }
    
    setFollowUp(followUpContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Calculate BMI and get category
    const category = calculateBmi(formData.tinggi_badan, formData.berat_badan);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/ibu/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Parse the result from backend
        const resultString = data.hasil_prediksi;
        let riskLevel = "Tidak Diketahui";
        
        if (resultString.includes("Risiko rendah")) {
          riskLevel = "Rendah";
        } else if (resultString.includes("Risiko sedang")) {
          riskLevel = "Sedang";
        } else if (resultString.includes("Risiko tinggi")) {
          riskLevel = "Tinggi";
        }
        
        setResult(riskLevel);
        determineFollowUp(riskLevel, category);
        setShowResult(true);
      } else {
        setResult("Gagal melakukan prediksi: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setResult("Terjadi kesalahan. Coba lagi: " + error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      usia: "",
      tinggi_badan: "",
      berat_badan: "",
      riwayat_gizi: "",
      konsumsi_gizi: "",
      cek_kesehatan: "",
      riwayat_stunting: "",
      pendidikan: "",
      pola_asuh: "",
      ekonomi: "",
    });
    setShowResult(false);
    setResult(null);
    setBmi(null);
    setBmiCategory("");
    setFollowUp(null);
    setErrors({});
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light vh-100">
          <SideUser />
        </Col>

        <Col md={9} className="p-4">
          <h2>Prediksi Risiko Stunting</h2>

          {!isLoggedIn ? (
            <Alert variant="warning">Silakan login terlebih dahulu!</Alert>
          ) : (
            <>
              {!showResult ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Berapa usia anda saat ini?*</Form.Label>
                    <Form.Control
                      type="number"
                      name="usia"
                      value={formData.usia}
                      onChange={handleChange}
                      isInvalid={!!errors.usia}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.usia}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Berapa Tinggi Badan Anda (cm)?*</Form.Label>
                    <Form.Control
                      type="number"
                      name="tinggi_badan"
                      value={formData.tinggi_badan}
                      onChange={handleChange}
                      isInvalid={!!errors.tinggi_badan}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tinggi_badan}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Berapa Berat Badan (kg) Anda?*</Form.Label>
                    <Form.Control
                      type="number"
                      name="berat_badan"
                      value={formData.berat_badan}
                      onChange={handleChange}
                      isInvalid={!!errors.berat_badan}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.berat_badan}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Apakah Anda pernah mengalami anemia atau kekurangan darah?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Ya"
                        name="riwayat_gizi"
                        value="ya"
                        checked={formData.riwayat_gizi === "ya"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.riwayat_gizi}
                      />
                      <Form.Check
                        type="radio"
                        label="Tidak"
                        name="riwayat_gizi"
                        value="tidak"
                        checked={formData.riwayat_gizi === "tidak"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.riwayat_gizi}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.riwayat_gizi ? 'block' : 'none' }}>
                      {errors.riwayat_gizi}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Seberapa sering anda mengonsumsi makanan bergizi (sayur, buah, protein, dll)?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Sering"
                        name="konsumsi_gizi"
                        value="sering"
                        checked={formData.konsumsi_gizi === "sering"}
                        onChange={handleChange}
                        isInvalid={!!errors.konsumsi_gizi}
                      />
                      <Form.Check
                        type="radio"
                        label="Jarang"
                        name="konsumsi_gizi"
                        value="jarang"
                        checked={formData.konsumsi_gizi === "jarang"}
                        onChange={handleChange}
                        isInvalid={!!errors.konsumsi_gizi}
                      />
                      <Form.Check
                        type="radio"
                        label="Tidak Pernah"
                        name="konsumsi_gizi"
                        value="tidak pernah"
                        checked={formData.konsumsi_gizi === "tidak pernah"}
                        onChange={handleChange}
                        isInvalid={!!errors.konsumsi_gizi}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.konsumsi_gizi ? 'block' : 'none' }}>
                      {errors.konsumsi_gizi}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Apakah anda rutin memeriksa Kesehatan ke puskesmas/klinik?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Ya"
                        name="cek_kesehatan"
                        value="ya"
                        checked={formData.cek_kesehatan === "ya"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.cek_kesehatan}
                      />
                      <Form.Check
                        type="radio"
                        label="Tidak"
                        name="cek_kesehatan"
                        value="tidak"
                        checked={formData.cek_kesehatan === "tidak"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.cek_kesehatan}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.cek_kesehatan ? 'block' : 'none' }}>
                      {errors.cek_kesehatan}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Apakah anda tahu apa itu stunting dan dampaknya bagi anak?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Ya"
                        name="riwayat_stunting"
                        value="ya"
                        checked={formData.riwayat_stunting === "ya"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.riwayat_stunting}
                      />
                      <Form.Check
                        type="radio"
                        label="Tidak"
                        name="riwayat_stunting"
                        value="tidak"
                        checked={formData.riwayat_stunting === "tidak"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.riwayat_stunting}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.riwayat_stunting ? 'block' : 'none' }}>
                      {errors.riwayat_stunting}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Apa Pendidikan terakhir anda?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Tidak Sekolah"
                        name="pendidikan"
                        value="tidak sekolah"
                        checked={formData.pendidikan === "tidak sekolah"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="SD"
                        name="pendidikan"
                        value="sd"
                        checked={formData.pendidikan === "sd"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="SMP"
                        name="pendidikan"
                        value="smp"
                        checked={formData.pendidikan === "smp"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="SMA"
                        name="pendidikan"
                        value="sma"
                        checked={formData.pendidikan === "sma"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="D3"
                        name="pendidikan"
                        value="d3"
                        checked={formData.pendidikan === "d3"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="S1"
                        name="pendidikan"
                        value="s1"
                        checked={formData.pendidikan === "s1"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                      <Form.Check
                        type="radio"
                        label="S2"
                        name="pendidikan"
                        value="s2"
                        checked={formData.pendidikan === "s2"}
                        onChange={handleChange}
                        isInvalid={!!errors.pendidikan}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.pendidikan ? 'block' : 'none' }}>
                      {errors.pendidikan}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Apakah anda pernah mendapatkan penyuluhan atau edukasi tentang kesehatan ibu dan anak?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Sudah"
                        name="pola_asuh"
                        value="sudah"
                        checked={formData.pola_asuh === "sudah"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.pola_asuh}
                      />
                      <Form.Check
                        type="radio"
                        label="Belum"
                        name="pola_asuh"
                        value="belum"
                        checked={formData.pola_asuh === "belum"}
                        onChange={handleChange}
                        inline
                        isInvalid={!!errors.pola_asuh}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.pola_asuh ? 'block' : 'none' }}>
                      {errors.pola_asuh}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group className="mb-3">
                    <Form.Label>Bagaimana Kondisi Ekonomi Anda?*</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Kurang Baik"
                        name="ekonomi"
                        value="kurang baik"
                        checked={formData.ekonomi === "kurang baik"}
                        onChange={handleChange}
                        isInvalid={!!errors.ekonomi}
                      />
                      <Form.Check
                        type="radio"
                        label="Cukup Baik"
                        name="ekonomi"
                        value="cukup baik"
                        checked={formData.ekonomi === "cukup baik"}
                        onChange={handleChange}
                        isInvalid={!!errors.ekonomi}
                      />
                      <Form.Check
                        type="radio"
                        label="Baik"
                        name="ekonomi"
                        value="baik"
                        checked={formData.ekonomi === "baik"}
                        onChange={handleChange}
                        isInvalid={!!errors.ekonomi}
                      />
                      <Form.Check
                        type="radio"
                        label="Baik Sekali"
                        name="ekonomi"
                        value="baik sekali"
                        checked={formData.ekonomi === "baik sekali"}
                        onChange={handleChange}
                        isInvalid={!!errors.ekonomi}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" style={{ display: errors.ekonomi ? 'block' : 'none' }}>
                      {errors.ekonomi}
                    </Form.Control.Feedback>
                  </Form.Group>
                
                  <Button type="submit" variant="primary" className="mt-3 me-2">
                    Prediksi
                  </Button>
                  <Button type="button" variant="outline-secondary" className="mt-3" onClick={handleReset}>
                    Reset Form
                  </Button>
                </Form>
              ) : (
                <div>
                  <Alert variant={result === "Rendah" ? "success" : result === "Sedang" ? "warning" : "danger"}>
                    <h4>Hasil Prediksi: Risiko {result}</h4>
                    {bmi && (
                      <p>
                        BMI Anda: {bmi} ({bmiCategory})
                      </p>
                    )}
                  </Alert>

                  <Card className="mt-3">
                    <Card.Body>
                      <Card.Title>Rekomendasi Tindak Lanjut</Card.Title>
                      {followUp}
                    </Card.Body>
                  </Card>

                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={handleReset}
                  >
                    Kembali ke Form
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default IbuPrediction;