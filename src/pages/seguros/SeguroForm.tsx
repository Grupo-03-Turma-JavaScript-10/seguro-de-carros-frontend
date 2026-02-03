import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { getMeusVeiculos, createApolice } from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext";

interface SeguroFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SeguroForm({ onSuccess, onCancel }: SeguroFormProps) {
  const { user } = useAuth();
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    loadVeiculos();
  }, [user]);

  async function loadVeiculos() {
    if (!user?.id) return;
    try {
      const res = await getMeusVeiculos();
      const meusVeiculos = res.data.filter((v: any) => v.cliente?.id === Number(user.id));
      setVeiculos(meusVeiculos);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar veículos");
    }
  }

  async function onSubmit(data: any) {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const veiculo = veiculos.find((v: any) => String(v.id) === data.veiculoId);
      if (!veiculo) throw new Error("Veículo não encontrado");
      
      // Calcula o valor baseado no tipo de seguro e idade do veículo
      const anoAtual = new Date().getFullYear();
      const idadeVeiculo = anoAtual - veiculo.ano;
      
      let valorBase = 0;
      switch (data.tipoSeguro) {
        case "BASICO":
          valorBase = 1000;
          break;
        case "COMPLETO":
          valorBase = 2000;
          break;
        case "PREMIUM":
          valorBase = 3500;
          break;
      }
      
      // Aplica desconto de 10% se o veículo tem mais de 10 anos
      const valor = idadeVeiculo > 10 ? valorBase * 0.9 : valorBase;
      
      // Calcula as datas de vigência (formato YYYY-MM-DD sem timezone)
      const hoje = new Date();
      const dataInicio = hoje.toISOString().split('T')[0];
      const dataFim = new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate())
        .toISOString()
        .split('T')[0];
      
      const payload = {
        valor: valor,
        tipoSeguro: data.tipoSeguro,
        cliente: user,
        veiculo: veiculo,
        dataInicio: dataInicio,
        dataFim: dataFim,
      };
      
      await createApolice(payload);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Erro ao salvar o seguro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={onCancel}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </button>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-4">
          Novo Seguro
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                Veículo
                </label>
                <select
                {...register("veiculoId", { required: "Selecione um veículo" })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e24f10] transition-colors appearance-none"
                >
                    <option value="">Selecione um veículo...</option>
                    {veiculos.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo} - {v.placa} ({v.ano})
                        </option>
                    ))}
                </select>
                {errors.veiculoId && (
                <span className="text-red-500 text-sm mt-1 block">{errors.veiculoId.message as string}</span>
                )}
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Seguro
                </label>
                <select
                {...register("tipoSeguro", { required: "Selecione o tipo de seguro" })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e24f10] transition-colors appearance-none"
                >
                    <option value="">Selecione o tipo...</option>
                    <option value="BASICO">Básico - R$ 1.000,00/ano</option>
                    <option value="COMPLETO">Completo - R$ 2.000,00/ano</option>
                    <option value="PREMIUM">Premium - R$ 3.500,00/ano</option>
                </select>
                {errors.tipoSeguro && (
                <span className="text-red-500 text-sm mt-1 block">{errors.tipoSeguro.message as string}</span>
                )}
                <div className="mt-3 p-3 bg-[#0a0a0a] border border-[#333] rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">💰 <strong className="text-white">Tabela de Preços:</strong></p>
                  <ul className="text-xs text-gray-400 space-y-1 ml-4">
                    <li>• <strong className="text-white">Básico:</strong> R$ 1.000,00/ano - Cobertura essencial</li>
                    <li>• <strong className="text-white">Completo:</strong> R$ 2.000,00/ano - Cobertura total</li>
                    <li>• <strong className="text-white">Premium:</strong> R$ 3.500,00/ano - Cobertura VIP</li>
                  </ul>
                  <p className="text-xs text-green-400 mt-2">✨ Desconto de 10% para veículos com mais de 10 anos!</p>
                </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || veiculos.length === 0}
              className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Cadastrar Seguro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
