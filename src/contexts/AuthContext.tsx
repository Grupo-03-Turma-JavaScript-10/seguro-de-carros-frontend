import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica se há usuário logado no localStorage
    const savedUser = localStorage.getItem("autoguard_current_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      // Busca usuários existentes
      const usersData = localStorage.getItem("autoguard_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Verifica se o email já está cadastrado
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        return false;
      }

      // Cria novo usuário
      const newUser = {
        id: Date.now().toString(),
        nome,
        email,
        senha, // Em produção, a senha deveria ser criptografada
      };

      users.push(newUser);
      localStorage.setItem("autoguard_users", JSON.stringify(users));

      // Loga o usuário automaticamente após cadastro
      const userWithoutPassword = { id: newUser.id, nome: newUser.nome, email: newUser.email };
      setUser(userWithoutPassword);
      localStorage.setItem("autoguard_current_user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return false;
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const usersData = localStorage.getItem("autoguard_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Busca usuário com email e senha correspondentes
      const foundUser = users.find((u: any) => u.email === email && u.senha === senha);

      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          nome: foundUser.nome,
          email: foundUser.email,
        };
        setUser(userWithoutPassword);
        localStorage.setItem("autoguard_current_user", JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("autoguard_current_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
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
