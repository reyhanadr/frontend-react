import React from "react";
import "../App.css";
import Navbar from "./Navbar";

const About = () => {
  const profileData = [
    {
      name: "Javanka Amedeo Cavendish",
      nim: "22040095",
      role: "Web Developer",
      img: "https://cavendishame.github.io/growtrack/profile.png",
    },
    {
      name: "Yadi Dharmawan",
      nim: "22040071",
      role: "IoT Engineer",
      img: "https://cavendishame.github.io/growtrack/Mawan.jpg",
    },
  ];

  const projects = [
    {
      title: "Sistem Informasi Tumbuh Kembang Balita",
      description: "Aplikasi prediksi stunting, prediksi calon ibu, dan saran MPASI",
      image: "https://cavendishame.github.io/growtrack/proyek1.png",
    },
    {
      title: "Alat Pengukur Tinggi & Berat Badan",
      description: "Alat Pengukut berbasis IoT secara real-time",
      image: "https://cavendishame.github.io/growtrack/proyek2.jpg",
    },
    {
      title: "Sistem Informasi Tumbuh Kembang Balita",
      description: "Aplikasi prediksi stunting, prediksi calon ibu, dan saran MPASI",
      image: "https://cavendishame.github.io/growtrack/proyek1.png",
    },
    {
      title: "Analisis Laporan Kejahatan menggunakan PySpark ",
      description: "PySpark adalah interface Python untuk Apache Spark, yang merupakan framework pengolahan data terdistribusi dan open-source. Spark dirancang untuk pengolahan dan analisis Big Data dan sangat efektif.",
      image: "https://cavendishame.github.io/growtrack/proyek4.jpg",
      link: "https://bisa.ai/portofolio/detail/NDM2Nw",
    },
    {
      title: "Pengolahan Citra dengan Geometric Transformation",
      description: "Transformasi geometri pada pengolahan citra digital.",
      image: "https://cavendishame.github.io/growtrack/proyek3.jpg",
      link: "https://bisa.ai/portofolio/detail/NDA4Nw",
    },
    {
      title: "Klasifikasi Diabetes menggunakan Metode SVM",
      description: "Metode ini terutama populer karena kemampuannya dalam menangani dataset dengan dimensi tinggi serta kemampuannya dalam menangani kasus-kasus di mana jumlah fitur (features) melebihi jumlah sampel. ",
      image: "https://cavendishame.github.io/growtrack/proyek5.jpg",
      link: "https://bisa.ai/portofolio/detail/NDA4Nw",
    },
    {
        title: "Pemilihan Model dan Peningkatan Performa Model dengan Dataset Iris",
        description: "Proyek ini bertujuan untuk mengeksplorasi, memilih, dan meningkatkan model prediktif menggunakan dataset Iris yang terkenal. Dataset ini terdiri dari empat fitur numerik: panjang dan lebar kelopak (sepal_length, sepal_width) dan panjang dan lebar mahkota bunga (petal_length, petal_width), serta satu label kategorikal, spesies bunga (species).",
        image: "https://cavendishame.github.io/growtrack/proyek6.jpg",
        link: "https://bisa.ai/portofolio/detail/NTA4NQ",
      },
      {
        title: "Analisis Data dan Eksplorasi Dataset Iris ",
        description: "Tujuan dari analisis ini adalah untuk memahami karakteristik dataset Iris melalui langkah-langkah pra-pemrosesan data dan eksplorasi data (EDA). Analisis ini akan membantu kita dalam mengidentifikasi pola dan hubungan antar fitur yang ada dalam dataset.",
        image: "https://cavendishame.github.io/growtrack/proyek7.jpg",
        link: "https://bisa.ai/portofolio/detail/NTA4Mg",
      },
  ];

  return (
    <>
      <Navbar />
      <div className="about-container">
        <section className="profiles">
          <h2>Profil Kami</h2>
          <div className="profile-list">
            {profileData.map((profile, index) => (
              <div className="profile-card" key={index}>
                <img src={profile.img} alt={profile.name} />
                <h3>{profile.name}</h3>
                <p>{profile.nim}</p>
                <p>{profile.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="projects">
          <h2>Proyek Kami</h2>
          <div className="project-list">
            {projects.map((project, index) => (
              <div className="project-card" key={index}>
                <img src={project.image} alt={project.title} />
                <h3>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact">
          <h2>Hubungi Kami</h2>
          <p>
            Instagram:{" "}
            <a
              href="https://www.instagram.com/ame_javanka/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ame_javanka
            </a>
          </p>
          <p>Email: cavendishame@gmail.com</p>
          <p>WhatsApp: 0821-1480-0448</p>
        </section>
      </div>
    </>
  );
};

export default About;
