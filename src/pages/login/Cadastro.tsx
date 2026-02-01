
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { register } from "../../services/Service";
import { Car, Eye, EyeOff } from "lucide-react";

export function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!nome || !email || !senha || !confirmarSenha || !cpf || !telefone) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (nome.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    // Validação de email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (!cpfValidator.isValid(cpf)) {
      setError("CPF inválido");
      return;
    }

    try {
      await register(nome, email, senha, cpf, telefone);
      navigate("/");
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <Car className="h-16 w-16 text-[#e24f10]" />
          </div>
          <h2 className="text-center text-3xl font-bold text-white">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-[#e6e6e6]">
            Junte-se ao AutoGuard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent"
                placeholder="João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>



            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                maxLength={14}
                className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>


            {/* Campos de senha agrupados no final */}
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
                  className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent pr-10"
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
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-[#e6e6e6] mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e24f10] focus:border-transparent pr-10"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#e24f10] hover:bg-[#c84410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e24f10] transition-colors"
            >
              Cadastrar
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#e6e6e6]">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-medium text-[#e24f10] hover:text-[#c84410] transition-colors">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}