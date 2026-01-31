import { useAuth } from "../../contexts/AuthContext";
export default function Seguros() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-4">Acesse sua conta para ver suas apólices</h2>
        <p className="mb-6 text-gray-400">Faça login para visualizar e gerenciar seus seguros.</p>
        <a href="/login" className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold transition-all">Entrar</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Minhas Apólices</h1>
          <button className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold transition-all">
            Nova Apólice
          </button>
        </div>
        <div className="grid gap-6">
          {/* Aqui você faz um map nas apólices do usuário */}
          <div className="bg-[#181818] rounded-xl p-6 border border-[#333] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-bold">Apólice #12345</div>
              <div className="text-gray-400">Veículo: Honda Civic - ABC1D23</div>
              <div className="text-gray-400">Valor: R$ 1.200,00</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-4 py-2 rounded-full font-bold">Visualizar</button>
              <button className="bg-white text-black px-4 py-2 rounded-full font-bold border border-[#e24f10] hover:bg-[#e24f10] hover:text-white transition-all">Editar</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-800 transition-all">Excluir</button>
            </div>
          </div>
          {/* ...outros cards */}
        </div>
      </div>
    </div>
  );
}
