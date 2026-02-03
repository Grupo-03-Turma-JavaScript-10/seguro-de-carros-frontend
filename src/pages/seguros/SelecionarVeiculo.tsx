import { useState, useEffect } from "react";
import { ArrowLeft, Car, Plus } from "lucide-react";
import { getMeusVeiculos, getApolices, createApolice, updateApolice } from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext";
import { FormVeiculo } from "./FormVeiculo";

interface SelecionarVeiculoProps {
  planoSelecionado: {
    tipo: "BASICO" | "COMPLETO" | "PREMIUM";
    titulo: string;
    preco: number;
  };
  apoliceParaAlterar?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SelecionarVeiculo({ planoSelecionado, apoliceParaAlterar, onSuccess, onCancel }: SelecionarVeiculoProps) {
  const { user } = useAuth();
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [apolices, setApolices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormVeiculo, setShowFormVeiculo] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);

  const normalizeTipo = (tipo: string) => {
    const normalized = (tipo || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

    if (normalized.includes("basico")) return "BASICO";
    if (normalized.includes("completo")) return "COMPLETO";
    if (normalized.includes("premium")) return "PREMIUM";

    return normalized.toUpperCase();
  };

  const getTipoLabel = (raw: any) => {
    if (!raw) return "";
    if (typeof raw === "string") return raw;
    if (typeof raw === "object") {
      return raw.nome || raw.tipo || raw.descricao || raw.name || "";
    }
    return String(raw);
  };

  const deriveTipoFromValor = (valor: any, anoVeiculo: number) => {
    const valorNum = Number(valor);
    if (!Number.isFinite(valorNum)) return "";
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - Number(anoVeiculo);
    const desconto = idade > 10 ? 0.9 : 1;

    const tabela = [
      { tipo: "BASICO", base: 1000 },
      { tipo: "COMPLETO", base: 2000 },
      { tipo: "PREMIUM", base: 3500 },
    ];

    const tolerancia = 1; // tolerância de R$1
    for (const item of tabela) {
      const esperado = item.base * desconto;
      if (Math.abs(esperado - valorNum) <= tolerancia) {
        return item.tipo;
      }
    }
    return "";
  };

  useEffect(() => {
    // Se está alterando, não precisa carregar veículos
    if (apoliceParaAlterar) {
      handleAlterarApolice();
      return;
    }
    loadVeiculos();
    loadApolices();
  }, [user]);

  async function loadVeiculos() {
    if (!user?.id) return;
    setLoadingVeiculos(true);
    try {
      const res = await getMeusVeiculos();
      setVeiculos(res.data);
      
      // Se não tem veículos, vai direto pro formulário
      if (res.data.length === 0) {
        setShowFormVeiculo(true);
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar veículos");
    } finally {
      setLoadingVeiculos(false);
    }
  }

  async function loadApolices() {
    if (!user?.id) return;
    try {
      const res = await getApolices();
      const minhasApolices = res.data.filter((a: any) => a.cliente?.id === Number(user.id));
      setApolices(minhasApolices);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAlterarApolice() {
    if (!apoliceParaAlterar || !user) return;
    setLoading(true);
    setError(null);
    try {
      const veiculo = apoliceParaAlterar.veiculo;
      const anoAtual = new Date().getFullYear();
      const idadeVeiculo = anoAtual - veiculo.ano;
      const valor = idadeVeiculo > 10 ? planoSelecionado.preco * 0.9 : planoSelecionado.preco;

      const payload = {
        valor,
        tipoSeguro: planoSelecionado.tipo,
        cliente: user,
        veiculo: veiculo,
      };

      await updateApolice(apoliceParaAlterar.id, payload);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Erro ao alterar apólice");
    } finally {
      setLoading(false);
    }
  }

  async function vincularVeiculo(veiculo: any) {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      if (!veiculo) throw new Error("Veículo não encontrado");
      const apoliceExistente = apolices.find((a: any) => a.veiculo?.id === veiculo.id);
      if (apoliceExistente) {
        throw new Error(`Este veículo já possui seguro ${apoliceExistente.tipoSeguro}`);
      }

      // Calcula o valor baseado no tipo de seguro e idade do veículo
      const anoAtual = new Date().getFullYear();
      const idadeVeiculo = anoAtual - veiculo.ano;
      const valor = idadeVeiculo > 10 ? planoSelecionado.preco * 0.9 : planoSelecionado.preco;

      // Calcula as datas de vigência (formato YYYY-MM-DD sem timezone)
      const hoje = new Date();
      const dataInicio = hoje.toISOString().split('T')[0];
      const dataFim = new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate())
        .toISOString()
        .split('T')[0];

      const payload = {
        valor: valor,
        tipoSeguro: planoSelecionado.tipo,
        cliente: user,
        veiculo: veiculo,
        dataInicio: dataInicio,
        dataFim: dataFim,
      };

      await createApolice(payload);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Erro ao criar apólice");
    } finally {
      setLoading(false);
    }
  }

  async function alterarSeguro(apolice: any, veiculo: any) {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const anoAtual = new Date().getFullYear();
      const idadeVeiculo = anoAtual - veiculo.ano;
      const valor = idadeVeiculo > 10 ? planoSelecionado.preco * 0.9 : planoSelecionado.preco;

      // Calcula as datas de vigência (formato YYYY-MM-DD sem timezone)
      const hoje = new Date();
      const dataInicio = hoje.toISOString().split('T')[0];
      const dataFim = new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate())
        .toISOString()
        .split('T')[0];

      const payload = {
        valor,
        tipoSeguro: planoSelecionado.tipo,
        cliente: user,
        veiculo: veiculo,
        dataInicio: dataInicio,
        dataFim: dataFim,
      };

      await updateApolice(apolice.id, payload);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Erro ao alterar apólice");
    } finally {
      setLoading(false);
    }
  }

  async function handleVeiculoCadastrado(novoVeiculo: any) {
    // Adiciona o novo veículo à lista
    setVeiculos(prev => [...prev, novoVeiculo]);
    setShowFormVeiculo(false);
    
    // Vincula automaticamente ao plano escolhido - passa o veículo diretamente
    await vincularVeiculo(novoVeiculo);
  }

  // Tela de confirmação quando está alterando plano existente
  if (apoliceParaAlterar && loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
      </div>
    );
  }

  if (showFormVeiculo) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => veiculos.length > 0 ? setShowFormVeiculo(false) : onCancel()}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </button>

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Plano Selecionado: {planoSelecionado.titulo}</h2>
          <p className="text-gray-400">Cadastre seu veículo para vincular ao plano</p>
        </div>

        <FormVeiculo
          clienteId={Number(user?.id)}
          onVeiculoCadastrado={handleVeiculoCadastrado}
          onCancel={() => setShowFormVeiculo(false)}
        />
      </div>
    );
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
        <h1 className="text-2xl font-bold text-white mb-2">Selecione o Veículo</h1>
        <p className="text-gray-400 mb-6">
          Plano <strong className="text-[#e24f10]">{planoSelecionado.titulo}</strong> - R$ {planoSelecionado.preco.toLocaleString("pt-BR")}/ano
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loadingVeiculos ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]\"></div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {veiculos.map((veiculo) => {
                const anoAtual = new Date().getFullYear();
                const idadeVeiculo = anoAtual - veiculo.ano;
                const temDesconto = idadeVeiculo > 10;
                const valorFinal = temDesconto ? planoSelecionado.preco * 0.9 : planoSelecionado.preco;
                const apoliceAtual = apolices.find((a: any) => String(a.veiculo?.id) === String(veiculo.id));
                const tipoRaw = apoliceAtual?.tipoSeguro ?? apoliceAtual?.tipo ?? apoliceAtual?.tipo_plano ?? apoliceAtual?.plano;
                const tipoByValor = deriveTipoFromValor(apoliceAtual?.valor, veiculo.ano);
                const tipoLabel = getTipoLabel(tipoRaw) || tipoByValor;
                const tipoAtual = normalizeTipo(String(tipoLabel || ""));
                const tipoSelecionado = normalizeTipo(planoSelecionado.tipo);
                const mesmoPlano = tipoAtual && tipoAtual === tipoSelecionado;
                const podeAlterar = tipoAtual && tipoAtual !== tipoSelecionado;

                return (
                  <div key={veiculo.id} className="space-y-2">
                    <div className="w-full p-4 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-[#e24f10] transition-colors text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Car className="w-5 h-5 text-[#e24f10] mt-1" />
                          <div>
                            <h3 className="text-white font-bold">
                              {veiculo.marca} {veiculo.modelo}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {veiculo.placa} • {veiculo.ano}
                            </p>
                            {apoliceAtual && (
                              <span className="inline-block mt-1 text-xs bg-[#e24f10]/10 text-[#e24f10] px-2 py-0.5 rounded">
                                Seguro atual: {tipoLabel || "(tipo não informado)"}
                              </span>
                            )}
                            {temDesconto && (
                              <span className="inline-block mt-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-2">
                                10% de desconto aplicado
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div>
                            <div className="text-white font-bold">
                              R$ {valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </div>
                            {temDesconto && (
                              <div className="text-xs text-gray-500 line-through">
                                R$ {planoSelecionado.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </div>

                          {apoliceAtual ? (
                            mesmoPlano ? (
                              <span className="text-xs text-gray-400">Plano atual</span>
                            ) : (
                              <button
                                onClick={() => alterarSeguro(apoliceAtual, veiculo)}
                                disabled={loading || !podeAlterar}
                                className="bg-[#e24f10] hover:bg-[#c23f0c] text-white text-xs px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                              >
                                Alterar
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => vincularVeiculo(veiculo)}
                              disabled={loading}
                              className="bg-[#e24f10] hover:bg-[#c23f0c] text-white text-xs px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                            >
                              Contratar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowFormVeiculo(true)}
              className="w-full py-3 border-2 border-dashed border-[#333] rounded-lg text-gray-400 hover:border-[#e24f10] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Cadastrar Novo Veículo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
