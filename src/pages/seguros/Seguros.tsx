import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getApolices, createApolice, deleteApolice, updateApolice, createVeiculo } from "../../services/Service";
import { Plus, Trash2, Edit, X, CheckCircle, AlertCircle, CarFront } from "lucide-react";

export default function Seguros() {
  const { user, isAuthenticated } = useAuth();
  const [apolices, setApolices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    valorFipe: "",
    ano: ""
  });

  useEffect(() => {
    if (isAuthenticated) loadApolices();
  }, [isAuthenticated]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadApolices = async () => {
    setLoading(true);
    try {
      const res = await getApolices();
      const ordenadas = Array.isArray(res.data) ? res.data.sort((a: any, b: any) => b.id - a.id) : [];
      setApolices(ordenadas);
    } catch (err) {
      showToast("Erro ao carregar lista.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (apolice: any) => {
    setIsEditing(true);
    setCurrentId(apolice.id);
    setFormData({
      placa: apolice.veiculo?.placa || "",
      modelo: apolice.veiculo?.modelo || "",
      valorFipe: apolice.valor?.toString() || "",
      ano: apolice.veiculo?.ano?.toString() || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let valorFinal = parseFloat(formData.valorFipe);
      const anoCarro = parseInt(formData.ano);
      const anoAtual = 2026;

      if (anoAtual - anoCarro > 10) {
        valorFinal = valorFinal * 0.8;
        showToast("Desconto de 20% aplicado!", "info");
      }

      const marcaDetectada = formData.modelo.trim().split(" ")[0] || "Generica";

      // 1. Criar Veículo primeiro
      const veiculoPayload = {
        placa: formData.placa.toUpperCase().trim(),
        modelo: formData.modelo.trim(),
        marca: marcaDetectada,
        ano: anoCarro,
        cliente: { id: user?.id }
      };

      const veiculoResponse = await createVeiculo(veiculoPayload);

      // 2. Criar/Atualizar Apólice usando o ID do veículo criado
      const payloadApolice = {
        numero: Math.floor(100000 + Math.random() * 900000).toString(),
        valor: valorFinal,
        cliente: { id: user?.id },
        veiculo: { id: veiculoResponse.data.id }
      };

      if (isEditing && currentId) {
        await updateApolice(currentId, payloadApolice);
        showToast("Alterado com sucesso!", "success");
      } else {
        await createApolice(payloadApolice);
        showToast("Cadastrado com sucesso!", "success");
      }

      setIsModalOpen(false);
      setFormData({ placa: "", modelo: "", valorFipe: "", ano: "" });
      setTimeout(loadApolices, 700);
      
    } catch (err: any) {
      console.error("Erro completo:", err.response);
      const mensagemErro = err.response?.data?.message || "Erro ao salvar. Verifique o console.";
      showToast(mensagemErro, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Excluir apólice definitivamente?")) {
      try {
        await deleteApolice(id);
        showToast("Excluído com sucesso!", "success");
        setApolices(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        showToast("Erro ao remover.", "error");
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4 font-sans">
      {toast && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-10 ${
          toast.type === "success" ? "bg-emerald-950 border-emerald-500 text-emerald-200" : 
          toast.type === "info" ? "bg-blue-950 border-blue-500 text-blue-200" : "bg-red-950 border-red-500 text-red-200"
        }`}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold uppercase text-[10px] tracking-widest">{toast.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-10">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">FROTA<span className="text-[#e24f10]">SEGUROS</span></h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Controle de Placas Ativas</p>
          </div>
          <button 
            onClick={() => { setIsEditing(false); setFormData({ placa: "", modelo: "", valorFipe: "", ano: "" }); setIsModalOpen(true); }}
            className="bg-[#e24f10] px-6 py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-all shadow-lg shadow-orange-950/20"
          >
            + Nova Apólice
          </button>
        </header>

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20 text-zinc-700 font-black animate-pulse uppercase italic">Carregando Dados...</div>
          ) : apolices.length === 0 ? (
            <div className="text-center py-20 text-zinc-700 font-bold uppercase">Nenhuma apólice encontrada.</div>
          ) : apolices.map((apolice) => (
            <div key={apolice.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center group hover:border-[#e24f10] transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[#e24f10] group-hover:bg-[#e24f10] group-hover:text-white transition-all">
                  <CarFront size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">
                    {apolice.veiculo?.placa || "SEM PLACA"}
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase mt-1 tracking-wider">
                    {apolice.veiculo?.modelo} <span className="text-zinc-700 mx-1">|</span> {apolice.veiculo?.ano}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-10 mt-6 md:mt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase italic">Custo Seguro</p>
                  <p className="text-xl font-black text-white font-mono">
                    R$ {apolice.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(apolice)} className="p-3 bg-zinc-800/50 rounded-xl text-zinc-500 hover:text-white transition-all"><Edit size={20}/></button>
                  <button onClick={() => handleDelete(apolice.id)} className="p-3 bg-zinc-800/50 rounded-xl text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[250]">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={28}/></button>
            <h2 className="text-2xl font-black uppercase mb-8 italic">{isEditing ? "Editar Registro" : "Nova Apólice"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block ml-1 tracking-widest">Placa do Carro</label>
                <input 
                  type="text" required placeholder="AAA-0000"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:border-[#e24f10] outline-none text-white font-black uppercase text-lg tracking-widest"
                  value={formData.placa} onChange={e => setFormData({...formData, placa: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block ml-1 tracking-widest">Modelo</label>
                <input 
                  type="text" required placeholder="Ex: Corolla XEI"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:border-[#e24f10] outline-none text-white"
                  value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block ml-1 tracking-widest">FIPE (R$)</label>
                  <input 
                    type="number" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:border-[#e24f10] outline-none text-white"
                    value={formData.valorFipe} onChange={e => setFormData({...formData, valorFipe: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block ml-1 tracking-widest">Ano</label>
                  <input 
                    type="number" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:border-[#e24f10] outline-none text-white"
                    value={formData.ano} onChange={e => setFormData({...formData, ano: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#e24f10] py-5 rounded-2xl font-black uppercase text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-orange-950/20">
                {isEditing ? "Confirmar Alteração" : "Finalizar Cadastro"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}