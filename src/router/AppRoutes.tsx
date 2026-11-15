import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import { HomeScreen } from "../screens/HomeScreen";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import useAuth from "../hooks/useAuth";

// Admin Pages
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminIncomingOrdersPage } from "../pages/admin/AdminIncomingOrdersPage";
import { AdminRecentOrdersPage } from "../pages/admin/AdminRecentOrdersPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";

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
        {/* Customer Facing Routes */}
        <Route
          path="/"
          element={
            <RequiredAuth>
              <HomeScreen />
            </RequiredAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/orders/incoming" element={<AdminIncomingOrdersPage />} />
        <Route path="/admin/orders/recent" element={<AdminRecentOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Catch-all redirect to Admin Login or Home */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
