import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, getMe, preloadUserData } from "../services/Service";

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  // register removido pois não há endpoint de cadastro na API
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há token salvo e busca o usuário autenticado
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);



  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, senha);
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Busca o usuário autenticado via endpoint /me
      const meRes = await getMe();
      const cliente = meRes.data;
      if (cliente) {
        setUser(cliente);
        localStorage.setItem("userId", cliente.id);
        // Preload dados em background (não aguarda)
        preloadUserData();
        return true;
      } else {
        setUser(null);
        localStorage.removeItem("userId");
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
