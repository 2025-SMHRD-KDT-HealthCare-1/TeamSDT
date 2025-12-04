import axios from "axios";

// export const API_BASE_URL = "http://172.20.10.3:3000";
export const API_BASE_URL = "https://christal-nonsignificative-noneternally.ngrok-free.dev";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await require("@react-native-async-storage/async-storage").default.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("Token load error:", e);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
