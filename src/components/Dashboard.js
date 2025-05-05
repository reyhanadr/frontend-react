import React, { useState, useEffect } from "react";
import { Carousel, Alert, Container } from "react-bootstrap";
import Navbar from "./Navbar";
import "../App.css"; 

const Dashboard = () => {
  const [index, setIndex] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    // Cek apakah login baru saja berhasil
    if (localStorage.getItem("justLoggedIn") === "true") {
      setShowSuccessAlert(true);
      localStorage.removeItem("justLoggedIn"); // Hapus agar alert tidak muncul lagi
      setTimeout(() => setShowSuccessAlert(false), 3000); // Hilangkan alert setelah 3 detik
    }
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const blogs = [
    {
      image: "https://sehatnegeriku.kemkes.go.id/wp-content/uploads/2023/01/52647353717_79679f67e2_c.jpg",
      title: "Prevalensi Stunting di Indonesia Turun ke 21,6% dari 24,4%",
      description: "Pelajari lebih lanjut tentang pentingnya nutrisi untuk pertumbuhan anak.",
      link: "https://sehatnegeriku.kemkes.go.id/baca/rilis-media/20230125/3142280/prevalensi-stunting-di-indonesia-turun-ke-216-dari-244/",
    },
    {
      image: "https://news.uad.ac.id/wp-content/uploads/Mahasiswa-KKN-dan-Dosen-Universitas-Ahmad-Dahlan-UAD-serta-Warga-Padukuhan-Blumbang-Banjararum-Foto-Istimewa.jpg",
      title: "Cegah Stunting Lewat MPASI Berbasis Pangan Lokal",
      description: "Bagaimana cara mencegah stunting sejak dini? Simak tips berikut!",
      link: "https://news.uad.ac.id/cegah-stunting-lewat-mpasi-berbasis-pangan-lokal/",
    },
    {
      image: "https://dpmptsp.blitarkota.go.id/uploads/berita/xsxAbdvSWrnXGzmyaqEpWzyN8TrKe9bqQogWGZAe.jpg",
      title: "Stunting? No Way! Dapatkan Anak Sehat dengan Nutrisi yang Tepat",
      description: "Rekomendasi makanan sehat untuk anak agar tumbuh optimal.",
      link: "https://dpmptsp.blitarkota.go.id/berita/stunting-no-way-dapatkan-anak-sehat-dengan-nutrisi-yang-tepat",
    },
  ];

  return (
    <div className="App">
      <Navbar />

      <Container className="mt-3">
        {/* Alert Login Berhasil */}
        {showSuccessAlert && (
          <Alert variant="success">
            <Alert.Heading>🎉 Selamat Datang!</Alert.Heading>
            <p>Anda berhasil login. Semoga harimu menyenangkan! 😊</p>
          </Alert>
        )}
      </Container>

      {/* Carousel */}
      <div className="carousel-container">
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={3000}
          wrap={true}
          indicators={true}
          controls={true}
        >
          {blogs.map((blog, idx) => (
            <Carousel.Item key={idx}>
              <a href={blog.link} target="_blank" rel="noopener noreferrer">
                <img
                  className="d-block w-100"
                  src={blog.image}
                  alt={`Slide ${idx + 1}`}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </a>
              <Carousel.Caption className="carousel-caption-box">
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Dashboard;
