import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
})

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/admin/login",
  "/auth/register",
  "/auth/google",
  "/auth/refresh",
  "/chat"
];

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

// Access Token expier after get new Access Token with using Refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = localStorage.getItem('REFRESH_TOKEN');

        if(refreshToken){
            try {
                
                const res = await api.post('/auth/refresh',{refreshToken})

                const newAccessToken = res.data.data.access_token

                localStorage.setItem("ACCESS_TOKEN", newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)

            } catch (refreshError) {
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");
            }
        }
    }
    return Promise.reject(error);
  }
);

export default api
