import { useState } from "react";
import { useForm } from "react-hook-form";
import { createVeiculo } from "../../services/Service";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface FormVeiculoProps {
  clienteId: number;
  onVeiculoCadastrado: (veiculo: any) => void;
  onCancel?: () => void;
}

export function FormVeiculo({ clienteId, onVeiculoCadastrado, onCancel }: FormVeiculoProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      marca: "",
      modelo: "",
      ano: new Date().getFullYear(),
      placa: "",
      cor: "",
      chassi: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        cliente: { id: clienteId },
      };
      const res = await createVeiculo(payload);
      toast.success("Veículo cadastrado com sucesso!");
      onVeiculoCadastrado(res.data);
      reset();
    } catch (err: any) {
      console.error("Erro ao cadastrar veículo:", err);
      toast.error(err?.response?.data?.message || "Erro ao cadastrar veículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-8">
      {onCancel && (
        <button
          onClick={onCancel}
          className="flex items-center text-gray-400 hover:text-[#e24f10] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </button>
      )}

      <h2 className="text-2xl font-bold text-white mb-2">Cadastrar Veículo</h2>
      <p className="text-gray-400 mb-8">Preencha os dados do novo veículo</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Marca *
            </label>
            <input
              type="text"
              {...register("marca", { required: "Marca é obrigatória" })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors"
              placeholder="Ex: Toyota"
            />
            {errors.marca && (
              <p className="text-red-500 text-sm mt-1">{errors.marca.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Modelo *
            </label>
            <input
              type="text"
              {...register("modelo", { required: "Modelo é obrigatório" })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors"
              placeholder="Ex: Corolla"
            />
            {errors.modelo && (
              <p className="text-red-500 text-sm mt-1">{errors.modelo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ano *
            </label>
            <input
              type="number"
              {...register("ano", {
                required: "Ano é obrigatório",
                min: { value: 1900, message: "Ano inválido" },
                max: { value: new Date().getFullYear() + 1, message: "Ano inválido" },
              })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors"
              placeholder="Ex: 2020"
            />
            {errors.ano && (
              <p className="text-red-500 text-sm mt-1">{errors.ano.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Placa *
            </label>
            <input
              type="text"
              {...register("placa", { required: "Placa é obrigatória" })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors uppercase font-mono"
              placeholder="ABC1234"
            />
            {errors.placa && (
              <p className="text-red-500 text-sm mt-1">{errors.placa.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cor
            </label>
            <input
              type="text"
              {...register("cor")}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors"
              placeholder="Ex: Prata"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chassi
            </label>
            <input
              type="text"
              {...register("chassi")}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#e24f10] focus:outline-none transition-colors font-mono text-sm"
              placeholder="Número do chassi"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-[#333]">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Cadastrar Veículo"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-[#333] text-gray-400 hover:text-white hover:border-[#e24f10] rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
