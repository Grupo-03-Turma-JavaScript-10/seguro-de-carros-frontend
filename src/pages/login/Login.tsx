import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Car, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    const success = await login(email, senha);

    if (success) {
      navigate("/");
    } else {
      setError("Email ou senha incorretos");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] bg-black flex items-center justify-center px-4 py-12">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#e24f10]"></div>
        </div>
      ) : (
        <div className="max-w-md w-full">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <Car className="h-16 w-16 text-[#e24f10]" />
          </div>
          <h2 className="text-center text-3xl font-bold text-white">
            Bem-vindo ao AutoGuard
          </h2>
          <p className="mt-2 text-center text-sm text-[#e6e6e6]">
            Faça login para acessar sua conta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#0a0a0a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#0a0a0a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent pr-10"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#e6e6e6]" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-[#e6e6e6]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/20 border border-red-800 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#e24f10] hover:bg-[#c84410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e24f10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#e6e6e6]">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="font-medium text-[#e24f10] hover:text-[#c84410] transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
        </div>
        </div>
      )}
    </div>
  );
}