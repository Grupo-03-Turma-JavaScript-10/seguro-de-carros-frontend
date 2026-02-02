import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { getMeusVeiculos, createVeiculo, updateVeiculo } from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function VeiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      marca: "",
      modelo: "",
      ano: new Date().getFullYear(),
      placa: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (id) {
      loadVeiculo();
    } else {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  async function loadVeiculo() {
    try {
      const res = await getMeusVeiculos();
      const veiculoEncontrado = res.data.find((v: any) => v.id === Number(id));

      if (veiculoEncontrado) {
        setValue("marca", veiculoEncontrado.marca);
        setValue("modelo", veiculoEncontrado.modelo);
        setValue("ano", veiculoEncontrado.ano);
        setValue("placa", veiculoEncontrado.placa);
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

  async function onSubmit(data: any) {
    if (!user) return;

    setSubmitting(true);
    try {
      const payload = {
        ...data,
        cliente: user,
      };

      if (id) {
        await updateVeiculo(Number(id), payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await createVeiculo(payload);
        toast.success("Veículo cadastrado com sucesso!");
      }

      navigate("/veiculos");
    } catch (error: any) {
      console.error("Erro ao salvar veículo:", error);
      toast.error(error?.response?.data?.message || "Erro ao salvar veículo");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
          <h1 className="text-3xl font-bold mb-2">
            {id ? "Editar Veículo" : "Novo Veículo"}
          </h1>
          <p className="text-gray-400 mb-8">
            {id ? "Atualize as informações do veículo" : "Cadastre um novo veículo"}
          </p>

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
            </div>

            <div className="flex gap-4 pt-6 border-t border-[#333]">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Salvando..." : id ? "Atualizar" : "Cadastrar"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/veiculos")}
                className="flex-1 px-6 py-3 border border-[#333] text-gray-400 hover:text-white hover:border-[#e24f10] rounded-lg font-bold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
