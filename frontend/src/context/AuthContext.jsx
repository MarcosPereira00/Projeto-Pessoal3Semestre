import { createContext, useContext, useState } from "react";
import { signup as signupRequest, login as loginRequest } from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "trilha-de-nascimento:auth";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  function persist(data) {
    setAuth(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage indisponivel, sessao continua so em memoria
    }
  }

  async function signup(data) {
    const result = await signupRequest(data);
    const { token, ...user } = result;
    persist({ token, user });
  }

  async function login(data) {
    const result = await loginRequest(data);
    const { token, ...user } = result;
    persist({ token, user });
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token),
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
