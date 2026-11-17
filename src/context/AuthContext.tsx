import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getMyDetails } from "../services/auth";
import api from "../services/api";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const refreshToken = localStorage.getItem("REFRESH_TOKEN");

      if (token) {
        try {
          setLoading(true);
          const res = await getMyDetails();
          // Backend returns { message: "OK", data: { id, name, email, roles } }
          setUser(res.data);
        } catch (err) {
          console.error("Auth init error with token:", err);
          // Token might be invalid or expired; interceptor will attempt refresh
          // If completely failed:
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
          console.error("Token refresh failed during auth init:", err);
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
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
