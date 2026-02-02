import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import { getMeusVeiculos, deleteVeiculo } from "../../services/Service";
import { toast } from "sonner";

export function VeiculoDelet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [veiculo, setVeiculo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadVeiculo();
  }, [id]);

  async function loadVeiculo() {
    try {
      const res = await getMeusVeiculos();
      const veiculoEncontrado = res.data.find((v: any) => v.id === Number(id));
      
      if (veiculoEncontrado) {
        setVeiculo(veiculoEncontrado);
      } else {
        toast.error("Veículo não encontrado");
        navigate("/veiculos");
      }
    } catch (error) {
      console.error("Erro ao carregar veículo:", error);
      toast.error("Erro ao carregar veículo");
      navigate("/veiculos");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteVeiculo(Number(id));
      toast.success("Veículo deletado com sucesso!");
      navigate("/veiculos");
    } catch (error: any) {
      console.error("Erro ao deletar veículo:", error);
      toast.error(error?.response?.data?.message || "Erro ao deletar veículo");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
      </div>
    );
  }

  if (!veiculo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/veiculos")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#e24f10] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-900/20 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Deletar Veículo?</h1>
            <p className="text-gray-400">
              Esta ação não pode ser desfeita. Todas as informações relacionadas a este veículo serão removidas.
            </p>
          </div>

          <div className="bg-[#0a0a0a] rounded-lg border border-[#333] p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Informações do Veículo:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Marca:</span>
                <span className="text-white font-medium">{veiculo.marca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Modelo:</span>
                <span className="text-white font-medium">{veiculo.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ano:</span>
                <span className="text-white font-medium">{veiculo.ano}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Placa:</span>
                <span className="text-white font-medium font-mono">{veiculo.placa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cor:</span>
                <span className="text-white font-medium capitalize">{veiculo.cor}</span>
              </div>
              {veiculo.chassi && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Chassi:</span>
                  <span className="text-white font-medium font-mono text-xs">{veiculo.chassi}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Confirmar Exclusão
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/veiculos")}
              className="flex-1 px-6 py-3 border border-[#333] text-gray-400 hover:text-white hover:border-[#e24f10] rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
