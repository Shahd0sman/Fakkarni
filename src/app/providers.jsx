import { useState, useEffect, useCallback } from "react";
import authService from "../services/authservice";
import { AuthContext } from "../hooks/useAuth";

export function AppProviders({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("fakkarny_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fakkarny_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem("fakkarny_token");
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getProfile();
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem("fakkarny_user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("fakkarny_token");
        localStorage.removeItem("fakkarny_user");
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function initAuth() {
      const activeToken = localStorage.getItem("fakkarny_token");
      if (!activeToken) {
        if (!ignore) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await authService.getProfile();
        if (!ignore && res && res.data) {
          setUser(res.data);
          localStorage.setItem("fakkarny_user", JSON.stringify(res.data));
        }
      } catch (err) {
        if (!ignore && err.response?.status === 401) {
          localStorage.removeItem("fakkarny_token");
          localStorage.removeItem("fakkarny_user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    initAuth();
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem("fakkarny_token", receivedToken);
    localStorage.setItem("fakkarny_user", JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const register = async (name, email, password) => {
    await authService.register({ name, email, password });
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("fakkarny_token");
    localStorage.removeItem("fakkarny_user");
    setToken(null);
    setUser(null);
  };

  const updateUserState = (updatedUser) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedUser };
      localStorage.setItem("fakkarny_user", JSON.stringify(next));
      return next;
    });
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUserState,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

