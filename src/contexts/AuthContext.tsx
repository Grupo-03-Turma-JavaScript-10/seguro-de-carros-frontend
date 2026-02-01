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
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Adicionado para evitar redirecionamentos errados antes de carregar o usuário
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do usuário baseado no email do Token
  const fetchUserData = async (email: string) => {
    try {
      const res = await getClientes();
      const cliente = res.data.find((c: any) => c.email === email);
      if (cliente) {
        setUser(cliente);
        localStorage.setItem("userId", cliente.id);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decodifica o token para pegar o email (sub)
        const payload = JSON.parse(atob(token.split('.')[1]));
        fetchUserData(payload.sub);
      } catch {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, senha);
      
      // O backend pode retornar 'token' ou 'access_token'. Ajustamos para aceitar ambos:
      const token = response.data.token || response.data.access_token;
      
      if (!token) return false;

      localStorage.setItem("token", token);

      // Decodifica o payload para pegar o email (campo 'sub' no JWT padrão)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const userEmail = payload.sub;

      // Busca os dados completos do cliente na API
      const clientesRes = await getClientes();
      const cliente = clientesRes.data.find((c: any) => c.email === userEmail);

      if (cliente) {
        setUser(cliente);
        localStorage.setItem("userId", String(cliente.id));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
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
        isLoading
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