import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import { HomeScreen } from "../screens/HomeScreen";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import useAuth from "../hooks/useAuth";

export type RequiredAuthProps = {
  children: ReactNode;
  roles?: string[];
};

export const RequiredAuth = ({ children, roles }: RequiredAuthProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-gray-500">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.some((role) => user?.roles?.includes(role))) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h1 className="text-lg font-bold text-gray-800">
          You do not have permission to access this page
        </h1>
      </div>
    );
  }
  return <>{children}</>;
};

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <RequiredAuth>
        <Route path="/" element={<HomeScreen />} />
        </RequiredAuth>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
