import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

type RequiredAuthProps = {
    children: ReactNode
    roles?: string[]
}

const RequiredAuth = ({children,roles}:RequiredAuthProps)=>{
    const {user,loading} = useAuth();

    if(loading){
        return <div>Loading...</div>
    }
    if (!user) {
        return <Navigate to={"/login"} replace/>
    }
    if (roles && !roles.some(role => user?.roles.includes(roles))) {
        return <div>
            <h1>
                You do not have permission to access this page
            </h1>
        </div>
    }
}

function Router() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            
        </Routes>
        </BrowserRouter>
    )
}