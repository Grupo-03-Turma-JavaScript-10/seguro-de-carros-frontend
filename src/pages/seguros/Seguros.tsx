import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApolices, deleteApolice } from "../../services/Service";
import { SeguroCard } from "./SeguroCard";
import { PlanoCard } from "./PlanoCard";
import { SelecionarVeiculo } from "./SelecionarVeiculo";
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

export default function Seguros() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [apolices, setApolices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [etapa, setEtapa] = useState<"lista" | "planos" | "veiculo">(
    location.state?.etapa || "lista"
  );
  const [planoSelecionado, setPlanoSelecionado] = useState<{
    tipo: "BASICO" | "COMPLETO" | "PREMIUM";
    titulo: string;
    preco: number;
  } | null>(location.state?.planoSelecionado || null);
  const [apoliceParaAlterar, setApoliceParaAlterar] = useState<any | null>(null);
  const [apoliceParaDeletar, setApoliceParaDeletar] = useState<any | null>(null);
  const [showDialogCancelar, setShowDialogCancelar] = useState(false);

  async function loadApolices() {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getApolices();
      const minhasApolices = res.data.filter((apolice: any) => apolice.cliente?.id === Number(user?.id));
      setApolices(minhasApolices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApolices();
  }, [isAuthenticated, user]);

  const searchTerm = search.trim().toLowerCase();
  const apolicesFiltradas = apolices.filter((apolice) => {
    if (!searchTerm) return true;
    const veiculo = apolice.veiculo || {};
    const alvo = [
      apolice.numeroApolice,
      apolice.tipoSeguro,
      apolice.tipo,
      veiculo.marca,
      veiculo.modelo,
      veiculo.placa,
      veiculo.ano,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return alvo.includes(searchTerm);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-4">Acesse sua conta para ver suas apólices</h2>
        <p className="mb-6 text-gray-400">Faça login para visualizar e gerenciar seus seguros.</p>
        <a href="/login" className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold transition-all">Entrar</a>
      </div>
    );
  }

  function handleSelecionarPlano(tipo: "BASICO" | "COMPLETO" | "PREMIUM", titulo: string, preco: number) {
    setPlanoSelecionado({ tipo, titulo, preco });
    setEtapa("veiculo");
  }

  function handleAlterarPlano(apolice: any) {
    setApoliceParaAlterar(apolice);
    setEtapa("planos");
  }

  function handleCancelarApolice(id: number) {
    const apolice = apolices.find(a => a.id === id);
    setApoliceParaDeletar(apolice);
    setShowDialogCancelar(true);
  }

  async function confirmarCancelamento() {
    if (!apoliceParaDeletar) return;

    try {
      await deleteApolice(apoliceParaDeletar.id);
      await loadApolices();
      toast.success("Apólice cancelada com sucesso!", {
        description: `A apólice #${apoliceParaDeletar.numeroApolice} foi cancelada.`,
      });
      setShowDialogCancelar(false);
      setApoliceParaDeletar(null);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao cancelar apólice", {
        description: error?.response?.data?.message || "Ocorreu um erro desconhecido",
      });
    }
  }

  // Exibe tela de seleção de veículo
  if (etapa === "veiculo" && planoSelecionado) {
    return (
      <SelecionarVeiculo
        planoSelecionado={planoSelecionado}
        apoliceParaAlterar={apoliceParaAlterar}
        onSuccess={() => {
          setEtapa("lista");
          setPlanoSelecionado(null);
          setApoliceParaAlterar(null);
          loadApolices();
        }}
        onCancel={() => {
          setEtapa(apoliceParaAlterar ? "lista" : "planos");
          setPlanoSelecionado(null);
          setApoliceParaAlterar(null);
        }}
      />
    );
  }

  // Exibe tela de seleção de planos
  if (etapa === "planos") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {apoliceParaAlterar ? "Alterar Plano" : "Escolha seu Plano"}
              </h1>
              <p className="text-gray-400">
                {apoliceParaAlterar 
                  ? `Alterando seguro do veículo ${apoliceParaAlterar.veiculo?.marca} ${apoliceParaAlterar.veiculo?.modelo}`
                  : "Selecione o plano ideal para proteger seu veículo"
                }
              </p>
            </div>
            <button
              onClick={() => {
                setEtapa("lista");
                setApoliceParaAlterar(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-bold transition-all"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlanoCard
              titulo="Básico"
              preco={1000}
              descricao="Proteção essencial para o seu veículo"
              beneficios={[
                "Cobertura contra terceiros",
                "Assistência 24h básica",
                "Guincho até 200km",
                "Carro reserva 7 dias",
              ]}
              isPlanoAtual={apoliceParaAlterar?.tipoSeguro === "BASICO"}
              onClick={() => handleSelecionarPlano("BASICO", "Básico", 1000)}
            />

            <PlanoCard
              titulo="Completo"
              preco={2000}
              descricao="Proteção total com benefícios extras"
              beneficios={[
                "Tudo do plano Básico",
                "Cobertura contra roubo e furto",
                "Cobertura de vidros",
                "Guincho ilimitado",
                "Carro reserva 15 dias",
                "Cobertura de acessórios",
              ]}
              destaque
              isPlanoAtual={apoliceParaAlterar?.tipoSeguro === "COMPLETO"}
              onClick={() => handleSelecionarPlano("COMPLETO", "Completo", 2000)}
            />

            <PlanoCard
              titulo="Premium"
              preco={3500}
              descricao="Máxima proteção e serviços VIP"
              beneficios={[
                "Tudo do plano Completo",
                "Cobertura internacional",
                "Carro reserva premium 30 dias",
                "Motorista à disposição",
                "Revisões incluídas",
                "Sem franquia",
                "Atendimento prioritário",
              ]}
              isPlanoAtual={apoliceParaAlterar?.tipoSeguro === "PREMIUM"}
              onClick={() => handleSelecionarPlano("PREMIUM", "Premium", 3500)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Exibe lista de apólices (tela padrão)
  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Meus Seguros</h1>
            <button
              className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-6 py-2 rounded-full font-bold transition-all"
              onClick={() => setEtapa("planos")}
            >
              Novo Seguro
            </button>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por apólice, placa, modelo ou tipo..."
              className="w-full md:max-w-md px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white placeholder-gray-500 focus:outline-none focus:border-[#e24f10] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
              </div>
            ) : apolices.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">Nenhuma apólice encontrada.</div>
            ) : apolicesFiltradas.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">Nenhuma apólice encontrada para sua busca.</div>
            ) : (
              apolicesFiltradas.map((apolice) => (
                <SeguroCard
                  key={apolice.id}
                  apolice={apolice}
                  onAlterarPlano={handleAlterarPlano}
                  onDelete={handleCancelarApolice}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de cancelamento */}
      <AlertDialog open={showDialogCancelar} onOpenChange={setShowDialogCancelar}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">Cancelar Apólice?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-base">
              Você está prestes a cancelar a apólice{" "}
              <span className="text-[#e24f10] font-bold">#{apoliceParaDeletar?.numeroApolice}</span>
              {apoliceParaDeletar?.veiculo && (
                <>
                  {" "}do veículo{" "}
                  <span className="text-white font-medium">
                    {apoliceParaDeletar.veiculo.marca} {apoliceParaDeletar.veiculo.modelo}
                  </span>
                </>
              )}
              .
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
              onClick={confirmarCancelamento}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, Cancelar Apólice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
