import { createContext,useState,useEffect } from "react";
import { getMyDetails } from "../services/auth";
import api from "../services/api";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({children}:any)=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


useEffect(() => {
    const initAuth = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        if (token) {
            try {
                setLoading(true);
                const res = await getMyDetails();

                setUser(res.data); 
            } catch (err) {
                console.log(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        } else if (refreshToken) {
            try {
                setLoading(true);
  
                const res = await api.post('/auth/refresh', { refreshToken });
                const newAccessToken = res.data.data.access_token;
                localStorage.setItem("ACCESS_TOKEN", newAccessToken);

                const userRes = await getMyDetails();
                setUser(userRes.data);
            } catch (err) {
                console.log("Refresh failed", err);
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");
                setUser(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setUser(null);
        }
    };

    initAuth();
}, []);

    return (
        <AuthContext.Provider value={{user,setUser,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;