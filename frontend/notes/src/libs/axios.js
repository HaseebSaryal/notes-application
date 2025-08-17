// src/libs/axios.js
import axios from "axios";
const BASE_URL = import.meta.env.MODE === "production" ? "/api" : "http://localhost:5000/api";  

const api = axios.create({
  baseURL: BASE_URL,// ✅ correct base URL (NO trailing slash)
});

export default api;
