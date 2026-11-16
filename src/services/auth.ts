import api from "./api";

export const login = async (email:string, password:string) => {
    const res = await api.post("/auth/login",{
        email,
        password
    })
    return res.data.data
}

export const register = async (name:string, email:string, password:string) => {
    const res = await api.post("/auth/register",{
        name,email,password
    })
    return res.data
}

export const getMyDetails = async () => {
    const res = await api.get("/auth/me")
    return res.data
}

export const adminLogin = async (email:string, password:string)=>{
    const res = await api.post("/auth/admin/login", {
        email,
        password
    });
    return res.data.data;
}

export const googleLogin = async (token: string) => {
    const res = await api.post("/auth/google", { token });
    return res.data.data; 
}

