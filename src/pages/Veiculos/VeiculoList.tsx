import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Car,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldX,
  Download,
} from "lucide-react";
import {
  getMeusVeiculos,
  deleteVeiculo,
  getApolices,
} from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../App/components/ui/alert.dialog";

export function VeiculoList() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [apolices, setApolices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [veiculoParaDeletar, setVeiculoParaDeletar] = useState<any | null>(
    null,
  );
  const [showDialogDeletar, setShowDialogDeletar] = useState(false);
  const [search, setSearch] = useState("");

  const searchTerm = search.trim().toLowerCase();
  const veiculosFiltrados = veiculos.filter((veiculo) => {
    if (!searchTerm) return true;
    const alvo = [veiculo.marca, veiculo.modelo, veiculo.placa, veiculo.ano]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return alvo.includes(searchTerm);
  });

  const exportarCSV = () => {
    if (veiculos.length === 0) return;
    const headers = ['Marca', 'Modelo', 'Ano', 'Placa'];
    const linhas = veiculos.map(v => [v.marca, v.modelo, v.ano, v.placa].join(','));
    const csv = [headers.join(','), ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veiculos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadVeiculos();
    }
  }, [isAuthenticated]);

  async function loadVeiculos() {
    try {
      const [veiculosRes, apolicesRes] = await Promise.all([
        getMeusVeiculos(),
        getApolices(),
      ]);
      setVeiculos(veiculosRes.data || []);
      setApolices(apolicesRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }

  const getTipoSeguro = (veiculoId: number) => {
    const apolice = apolices.find((a) => a.veiculo?.id === veiculoId);
    if (!apolice) return null;
    return (
      apolice.tipoSeguro ||
      apolice.tipo ||
      apolice.tipo_plano ||
      apolice.plano ||
      null
    );
  };

  const getTipoLabel = (tipo: string | null) => {
    if (!tipo) return "Sem seguro";
    const normalizado = String(tipo).toUpperCase();
    if (normalizado.includes("BASICO")) return "Básico";
    if (normalizado.includes("COMPLETO")) return "Completo";
    if (normalizado.includes("PREMIUM")) return "Premium";
    return String(tipo);
  };

  const handleDelete = (veiculo: any) => {
    setVeiculoParaDeletar(veiculo);
    setShowDialogDeletar(true);
  };

  const confirmarDelete = async () => {
    if (!veiculoParaDeletar) return;
    setDeletingId(veiculoParaDeletar.id);
    try {
      await deleteVeiculo(veiculoParaDeletar.id);
      toast.success("Veículo deletado com sucesso!");
      loadVeiculos();
      setShowDialogDeletar(false);
      setVeiculoParaDeletar(null);
    } catch (error: any) {
      console.error("Erro ao deletar veículo:", error);
      toast.error(error?.response?.data?.message || "Erro ao deletar veículo");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-4">
          Acesse sua conta para ver seus veículos
        </h2>
        <p className="mb-6 text-gray-400">
          Faça login para visualizar e gerenciar seus veículos.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold transition-all"
        >
          Entrar
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Meus Veículos</h1>
              <p className="text-gray-400">
                Gerencie seus veículos cadastrados
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportarCSV}
                disabled={veiculos.length === 0}
                className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" /> CSV
              </button>
              <button
                onClick={() => navigate("/novo-veiculo")}
                className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" /> Novo Veículo
              </button>
            </div>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo, placa ou ano..."
              className="w-full md:max-w-md px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-[#e24f10] transition-colors"
            />
          </div>

          {veiculos.length === 0 ? (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white">
                Nenhum veículo cadastrado
              </h3>
              <p className="text-gray-400 mt-2">
                Comece adicionando um novo veículo.
              </p>
            </div>
          ) : veiculosFiltrados.length === 0 ? (
            <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <Car className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">
                Nenhum veículo encontrado
              </h3>
              <p className="text-gray-400 mt-2">Tente ajustar sua busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {veiculosFiltrados.map((veiculo) => (
                <div
                  key={veiculo.id}
                  className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden hover:border-[#e24f10] transition-all p-6 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#e24f10]/10 p-3 rounded-lg">
                      <Car className="w-6 h-6 text-[#e24f10]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {veiculo.marca} {veiculo.modelo}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Ano: {veiculo.ano}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 grow">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Placa:</span>
                      <span className="text-white font-mono">
                        {veiculo.placa}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Seguro:</span>
                      {getTipoSeguro(veiculo.id) ? (
                        <span className="text-green-400 font-semibold inline-flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" />
                          {getTipoLabel(getTipoSeguro(veiculo.id))}
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold inline-flex items-center gap-1">
                          <ShieldX className="w-4 h-4" />
                          Sem seguro
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[#333]">
                    <button
                      onClick={() => navigate(`/editar-veiculo/${veiculo.id}`)}
                      className="flex-1 bg-[#333] hover:bg-[#444] text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(veiculo)}
                      disabled={deletingId === veiculo.id}
                      className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === veiculo.id ? (
                        "Deletando..."
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" /> Deletar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={showDialogDeletar} onOpenChange={setShowDialogDeletar}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">
              Deletar Veículo?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-base">
              Você está prestes a deletar o veículo{" "}
              <span className="text-white font-medium">
                {veiculoParaDeletar?.marca} {veiculoParaDeletar?.modelo}
              </span>
              {veiculoParaDeletar?.placa && <> ({veiculoParaDeletar.placa})</>}.
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#333] hover:bg-[#444] text-white border-0">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
