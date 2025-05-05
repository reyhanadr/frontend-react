import axios from "axios";

const API_URL = "http://127.0.0.1:5000/auth"; // Sesuaikan dengan backend

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Data berisi token
  } catch (error) {
    throw error.response?.data || "Login gagal!";
  }
};
