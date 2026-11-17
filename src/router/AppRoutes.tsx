import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { MenuPage } from "../pages/MenuPage";
import { CartPage } from "../pages/CartPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import useAuth from "../hooks/useAuth";

// Admin Pages
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminIncomingOrdersPage } from "../pages/admin/AdminIncomingOrdersPage";
import { AdminRecentOrdersPage } from "../pages/admin/AdminRecentOrdersPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminCustomersPage } from "../pages/admin/AdminCustomersPage";
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

export const AdminRequiredAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-400">Verifying admin session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.roles?.includes("ADMIN")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Facing Routes */}
        <Route
          path="/"
          element={
            <RequiredAuth roles={["ADMIN", "USER"]}>
              <HomeScreen />
            </RequiredAuth>
          }
        />
        <Route
          path="/menu"
          element={
            <RequiredAuth roles={["ADMIN", "USER"]}>
              <MenuPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequiredAuth roles={["ADMIN", "USER"]}>
              <CartPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequiredAuth roles={["ADMIN", "USER"]}>
              <MyAccountPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/my-account"
          element={
            <RequiredAuth roles={["ADMIN", "USER"]}>
              <MyAccountPage />
            </RequiredAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRequiredAuth>
              <AdminDashboardPage />
            </AdminRequiredAuth>
          }
        />

        <Route
          path="/admin/orders/incoming"
          element={
            <AdminRequiredAuth>
              <AdminIncomingOrdersPage />
            </AdminRequiredAuth>
          }
        />

        <Route
          path="/admin/orders/recent"
          element={
            <AdminRequiredAuth>
              <AdminRecentOrdersPage />
            </AdminRequiredAuth>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRequiredAuth>
              <AdminProductsPage />
            </AdminRequiredAuth>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminRequiredAuth>
              <AdminCustomersPage />
            </AdminRequiredAuth>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRequiredAuth>
              <AdminSettingsPage />
            </AdminRequiredAuth>
          }
        />

        {/* Catch-all redirect to Admin Dashboard or Home */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
