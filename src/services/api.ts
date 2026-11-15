import axios, {AxiosError} from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register","/auth/google"];

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("ACCESS_TOKEN");

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) =>{
        return config.url?.includes(url) ?? false
    })

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Baarer ${token}`
    }
    return config;
})

export default api