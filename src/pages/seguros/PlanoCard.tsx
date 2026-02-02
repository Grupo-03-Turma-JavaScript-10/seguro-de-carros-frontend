import { Check } from "lucide-react";

interface PlanoCardProps {
  titulo: string;
  preco: number;
  descricao: string;
  beneficios: string[];
  destaque?: boolean;
  isPlanoAtual?: boolean;
  onClick: () => void;
}

export function PlanoCard({ titulo, preco, descricao, beneficios, destaque, isPlanoAtual, onClick }: PlanoCardProps) {
  if (isPlanoAtual) {
    return (
      <div
        className="relative p-6 rounded-xl border-2 bg-[#1a1a1a] border-[#555] opacity-60 cursor-not-allowed flex flex-col"
      >
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#555] text-white px-4 py-1 rounded-full text-xs font-bold">
          PLANO ATUAL
        </div>

        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-400 mb-2">{titulo}</h3>
          <p className="text-sm text-gray-500">{descricao}</p>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm text-gray-500">R$</span>
            <span className="text-4xl font-bold text-gray-400">{preco.toLocaleString("pt-BR")}</span>
            <span className="text-sm text-gray-500">/ano</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Este é o seu plano atual</p>
        </div>

        <ul className="space-y-3 mb-6 grow">
          {beneficios.map((beneficio, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 shrink-0 mt-0.5 text-gray-600" />
              <span className="text-sm text-gray-500">{beneficio}</span>
            </li>
          ))}
        </ul>

        <button
          disabled
          className="w-full py-3 rounded-lg font-bold bg-[#333] text-gray-500 cursor-not-allowed"
        >
          Plano Atual
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 flex flex-col ${
        destaque
          ? "bg-linear-to-br from-[#e24f10] to-[#c23f0c] border-[#e24f10] shadow-2xl shadow-[#e24f10]/20"
          : "bg-[#1a1a1a] border-[#333] hover:border-[#e24f10]"
      }`}
    >
      {destaque && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-[#e24f10] px-4 py-1 rounded-full text-xs font-bold">
          MAIS POPULAR
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2">{titulo}</h3>
        <p className={`text-sm ${destaque ? "text-white/80" : "text-gray-400"}`}>{descricao}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-sm ${destaque ? "text-white/80" : "text-gray-400"}`}>R$</span>
          <span className="text-4xl font-bold text-white">{preco.toLocaleString("pt-BR")}</span>
          <span className={`text-sm ${destaque ? "text-white/80" : "text-gray-400"}`}>/ano</span>
        </div>
        <p className="text-xs text-green-400 mt-1">10% off para carros com +10 anos</p>
      </div>

      <ul className="space-y-3 mb-6 grow">
        {beneficios.map((beneficio, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`w-5 h-5 shrink-0 mt-0.5 ${destaque ? "text-white" : "text-[#e24f10]"}`} />
            <span className={`text-sm ${destaque ? "text-white" : "text-gray-300"}`}>{beneficio}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-bold transition-colors ${
          destaque
            ? "bg-white text-[#e24f10] hover:bg-gray-100"
            : "bg-[#e24f10] text-white hover:bg-[#c23f0c]"
        }`}
      >
        Escolher Plano
      </button>
    </div>
  );
}
