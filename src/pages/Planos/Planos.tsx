import { useNavigate } from "react-router-dom";
import { Shield, Zap, Heart, Award, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const plans = [
  {
    id: 1,
    tipo: "BASICO",
    name: "Básico",
    icon: Shield,
    color: "#666",
    price: 1000,
    description: "Proteção essencial para o seu veículo",
    popular: false,
    features: [
      "Cobertura contra terceiros",
      "Assistência 24h básica",
      "Guincho até 200km",
      "Carro reserva 7 dias",
    ],
  },
  {
    id: 2,
    tipo: "COMPLETO",
    name: "Completo",
    icon: Shield,
    color: "#e24f10",
    price: 2000,
    description: "Proteção total com benefícios extras",
    popular: true,
    features: [
      "Tudo do plano Básico",
      "Cobertura contra roubo e furto",
      "Cobertura de vidros",
      "Guincho ilimitado",
      "Carro reserva 15 dias",
      "Cobertura de acessórios",
    ],
  },
  {
    id: 3,
    tipo: "PREMIUM",
    name: "Premium",
    icon: Shield,
    color: "#FFD700",
    price: 3500,
    description: "Máxima proteção e serviços VIP",
    popular: false,
    features: [
      "Tudo do plano Completo",
      "Cobertura internacional",
      "Carro reserva premium 30 dias",
      "Motorista à disposição",
      "Revisões incluídas",
      "Sem franquia",
      "Atendimento prioritário",
    ],
  },
];

export function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleContratar = (plan: any) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Vai direto para seleção de veículo com o plano pré-selecionado
    navigate("/seguros", {
      state: {
        planoSelecionado: {
          tipo: plan.tipo,
          titulo: plan.name,
          preco: plan.price,
        },
        etapa: "veiculo",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#e24f10]/10 via-transparent to-[#0a0a0a]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4">
            <span className="bg-[#e24f10]/20 text-[#e24f10] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-[#e24f10]/30">
              Nossos Planos
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Escolha a <span className="text-[#e24f10]">Proteção Perfeita</span>
            <br />para seu Veículo
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Planos completos com cobertura nacional, assistência 24h e tecnologia de ponta para garantir sua tranquilidade
          </p>

          {/* Badges de Benefícios */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-[#e24f10]" />
              <span className="text-sm text-gray-300">Ativação Imediata</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#e24f10]" />
              <span className="text-sm text-gray-300">Sem Burocracia</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-[#e24f10]" />
              <span className="text-sm text-gray-300">Suporte Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl border-2 overflow-hidden transition-all duration-300 flex flex-col h-full ${
                  plan.popular
                    ? "border-[#e24f10] shadow-2xl shadow-[#e24f10]/20 md:scale-105 z-10"
                    : "border-[#333] hover:border-[#666]"
                } hover:shadow-xl`}
              >
                {/* Badge Popular */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#e24f10] text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}

                <div className="p-4 flex flex-col h-full">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-2 ${
                        plan.popular ? "bg-[#e24f10]/20" : "bg-[#333]"
                      }`}
                    >
                      <Shield
                        className="w-8 h-8"
                        style={{ color: plan.color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-0.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-tight">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4 pb-4 border-b border-[#333]">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-gray-400 text-sm">R$</span>
                      <span className="text-3xl font-bold text-white">
                        {plan.price.toLocaleString("pt-BR")}
                      </span>
                        <span className="text-gray-400 text-sm">/mês</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      10% off para carros com +10 anos
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4 grow">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      O que está incluído:
                    </h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div
                          className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.popular ? "bg-[#e24f10]" : "bg-[#333]"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-300 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleContratar(plan)}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                      plan.popular
                        ? "bg-[#e24f10] hover:bg-[#c23f0c] text-white shadow-lg shadow-[#e24f10]/30 hover:shadow-xl hover:shadow-[#e24f10]/40 hover:scale-105"
                        : "bg-[#333] hover:bg-[#444] text-white"
                    }`}
                  >
                    Contratar Agora
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-linear-to-r from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Dúvidas sobre qual plano escolher?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Nossa equipe está pronta para ajudar você a encontrar a proteção ideal para seu veículo e seu bolso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:0800123456"
                  className="bg-[#333] hover:bg-[#444] text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                >
                  📞 0800 123 456
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
