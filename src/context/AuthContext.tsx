import { createContext,useState,useEffect } from "react";
import { getMyDetails } from "../services/auth";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({children}:any)=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("ACCESS_TOKEN");

    useEffect(()=>{
        if (token) {
            setLoading(true);
            getMyDetails().then((res)=>{
                if (res) {
                    setUser(res)
                }else {
                    setUser(null)
                    console.log("NO USER")
                }
            }).catch((err)=>{
                console.log(err)
            }).finally(()=>{
                setLoading(false)
            })
        }else{
            setLoading(false)
            setUser(null)
        }
    },[])

    return (
        <AuthContext.Provider value={{user,setUser,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;