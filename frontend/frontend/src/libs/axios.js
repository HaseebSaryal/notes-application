// src/libs/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ correct base URL (NO trailing slash)
});

export default api;
