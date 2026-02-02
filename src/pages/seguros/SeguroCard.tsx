import { Trash2, DollarSign, Shield, Car, RefreshCw, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface SeguroCardProps {
  apolice: any;
  onDelete?: (id: number) => void;
  onAlterarPlano?: (apolice: any) => void;
}

export function SeguroCard({ apolice, onDelete, onAlterarPlano }: SeguroCardProps) {
  const parseDate = (value: string | Date) => {
    if (typeof value === 'string') {
      const match = value.match(/^\d{4}-\d{2}-\d{2}$/);
      if (match) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
    }
    return new Date(value);
  };

  const getTipoDisplay = () => {
    const tipo = apolice.tipoSeguro || apolice.tipo || '';
    if (tipo.includes('BASICO') || tipo.includes('BÁSICO')) return 'Básico';
    if (tipo.includes('COMPLETO')) return 'Completo';
    if (tipo.includes('PREMIUM')) return 'Premium';
    return 'Não especificado';
  };

  const getStatusBadge = () => {
    if (!apolice.dataFim) return null;

    const hoje = new Date();
    const dataFim = parseDate(apolice.dataFim);
    const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

    if (diasRestantes < 0) {
      return {
        label: 'Vencida',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-500',
        icon: AlertCircle,
      };
    } else if (diasRestantes <= 30) {
      return {
        label: `Vence em ${diasRestantes}d`,
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-500',
        icon: AlertCircle,
      };
    } else {
      return {
        label: 'Ativa',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-500',
        icon: CheckCircle,
      };
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    if (typeof date === 'string') {
      // Se vier no formato YYYY-MM-DD, formata sem converter timezone
      const match = date.match(/^\d{4}-\d{2}-\d{2}$/);
      if (match) {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      }
    }
    const d = parseDate(date);
    return d.toLocaleDateString('pt-BR');
  };

  const status = getStatusBadge();
  const StatusIcon = status?.icon || AlertCircle;

  return (
    <div
      className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] overflow-hidden hover:border-[#e24f10] transition-all duration-300 group hover:shadow-2xl hover:shadow-[#e24f10]/10 flex flex-col h-full"
    >
      {/* Header com Gradient */}
      <div className="h-40 bg-linear-to-br from-[#e24f10]/20 via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-[#e24f10]/10 backdrop-blur-sm p-6 rounded-full group-hover:bg-[#e24f10]/20 transition-colors">
            <Shield className="w-16 h-16 text-[#e24f10] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Badge da Apólice */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-[#e24f10] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            Apólice #{apolice.numeroApolice || apolice.id}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 grow flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#e24f10] transition-colors flex items-center gap-2">
          <Car className="w-6 h-6" />
          {apolice.veiculo?.marca} {apolice.veiculo?.modelo}
        </h3>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mb-6">
          <DollarSign className="w-6 h-6 text-[#e24f10]" />
          <span className="text-3xl font-bold text-white">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL',
              minimumFractionDigits: 2 
            }).format(apolice.valor || 0)}
          </span>
          <span className="text-sm text-gray-500 self-end mb-1">/mês</span>
        </div>

        {/* Status Badge */}
        {status && (
          <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`w-4 h-4 ${status.textColor}`} />
            <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
          </div>
        )}

        {/* Detalhes do Veículo */}
        <div className="space-y-2 mb-6 grow">
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <span className="font-medium">Tipo de Seguro:</span>
            <span className="text-[#e24f10] font-bold">{getTipoDisplay()}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <span className="font-medium">Placa:</span>
            <span className="text-white font-mono">{apolice.veiculo?.placa || "-"}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <span className="font-medium">Ano:</span>
            <span className="text-white">{apolice.veiculo?.ano || "-"}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <span className="font-medium">Cliente:</span>
            <span className="text-white">{apolice.cliente?.nome || "-"}</span>
          </div>
          
          {/* Datas da Vigência */}
          {(apolice.dataInicio || apolice.dataFim) && (
            <div className="flex items-start gap-2 text-gray-400 text-sm mt-3 pt-3 border-t border-[#333]">
              <Calendar className="w-4 h-4 text-[#e24f10] mt-0.5 shrink-0" />
              <div className="grow">
                <div className="text-xs text-gray-500 mb-1">Vigência</div>
                <div className="text-white text-xs">
                  {formatDate(apolice.dataInicio)} a {formatDate(apolice.dataFim)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com ações */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#333]">
          <button
            onClick={() => onAlterarPlano?.(apolice)}
            className="w-full bg-linear-to-r from-[#e24f10] to-[#ff6b35] hover:from-[#c23f0c] hover:to-[#e24f10] text-white px-4 py-2.5 rounded-lg font-bold transition-all hover:scale-105 text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Alterar Plano
          </button>
          
          <button
            onClick={() => onDelete?.(apolice.id)}
            className="w-full bg-[#1a1a1a] hover:bg-red-500/10 text-gray-400 hover:text-red-500 px-4 py-2.5 rounded-lg font-bold transition-all hover:scale-105 text-sm border border-[#333] hover:border-red-500/50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Cancelar Apólice
          </button>
        </div>
      </div>
    </div>
  );
}
