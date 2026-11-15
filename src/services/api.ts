import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/google"];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => {
        return config.url?.includes(url) ?? false
    })

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
)

export default api
