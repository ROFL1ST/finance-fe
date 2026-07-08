import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    // Access Zustand store outside React component using getState()
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
