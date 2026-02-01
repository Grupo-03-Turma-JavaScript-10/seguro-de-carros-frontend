import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext";
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
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nome || !email || !senha || !confirmarSenha || !cpf || !telefone) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await register(nome, email, senha, cpf, telefone);
      
      const logadoComSucesso = await login(email, senha);
      
      if (logadoComSucesso) {
        navigate("/");
      } else {
        navigate("/login");
      }
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
          <h2 className="text-center text-3xl font-bold text-white">Crie sua conta</h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nome completo" 
            className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="CPF" 
            className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Telefone" 
            className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
          />
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha" 
              className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
            />
            <button 
              type="button" 
              className="absolute right-3 top-2.5 text-gray-400" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirmar senha" 
              className="w-full px-3 py-2 border border-[#4c4b4b] bg-[#1a1a1a] text-white rounded-md focus:ring-2 focus:ring-[#e24f10] outline-none" 
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} 
            />
            <button 
              type="button" 
              className="absolute right-3 top-2.5 text-gray-400" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-2 bg-[#e24f10] text-white font-bold rounded-md hover:bg-[#c84410] transition-colors"
          >
            Cadastrar
          </button>
          
          <p className="text-center text-sm text-gray-400">
            Já tem conta? <Link to="/login" className="text-[#e24f10]">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}