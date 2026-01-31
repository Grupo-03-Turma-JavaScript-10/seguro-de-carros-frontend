
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, getClientes } from "../services/Service";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica se há token salvo e busca o usuário autenticado
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      getClientes()
        .then((res) => {
          const cliente = res.data.find((c: any) => String(c.id) === String(userId));
          setUser(cliente || null);
        })
        .catch(() => setUser(null));
    }
  }, []);



  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, senha);
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Decodifica o JWT para pegar o email (sub)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const userEmail = payload.sub;

      // Busca todos os clientes e filtra pelo email
      const clientesRes = await getClientes();
      const cliente = clientesRes.data.find((c: any) => c.email === userEmail);
      if (cliente) {
        setUser(cliente);
        localStorage.setItem("userId", cliente.id);
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
