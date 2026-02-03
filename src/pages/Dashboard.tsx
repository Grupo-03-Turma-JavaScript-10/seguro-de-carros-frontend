import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApolices, getMeusVeiculos } from '../services/Service';
import { Car, AlertCircle, TrendingUp, Shield, Download } from 'lucide-react';

interface ApoliceComStatus {
  id: number;
  numeroApolice: string;
  valor: number;
  tipoSeguro: string;
  veiculo: any;
  cliente: any;
  dataInicio: string;
  dataFim: string;
  status: 'ativa' | 'vencendo' | 'vencida';
  diasRestantes: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [apolices, setApolices] = useState<ApoliceComStatus[]>([]);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (value: string | Date) => {
    if (!value) return '-';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-');
      return `${day}/${month}/${year}`;
    }
    return parseDate(value).toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [apolicesRes, veiculosRes] = await Promise.all([
          getApolices(),
          getMeusVeiculos(),
        ]);

        // Processa apólices com status e dias restantes
        const apolicesData = apolicesRes.data || [];
        const veiculosData = veiculosRes.data || [];

        // Filtra apólices do usuário e processa status
        const apolicesComStatus = apolicesData
          .filter((apolice: any) => apolice.cliente?.id === Number(user?.id))
          .map((apolice: any) => {
            const hoje = new Date();
            const dataFim = parseDate(apolice.dataFim);
            const diasRestantes = Math.ceil(
              (dataFim.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
            );

            let status: 'ativa' | 'vencendo' | 'vencida' = 'ativa';
            if (diasRestantes < 0) {
              status = 'vencida';
            } else if (diasRestantes <= 30) {
              status = 'vencendo';
            }

            return {
              ...apolice,
              status,
              diasRestantes,
            };
          })
          .sort((a: ApoliceComStatus, b: ApoliceComStatus) => a.diasRestantes - b.diasRestantes);

        setApolices(apolicesComStatus);
        setVeiculos(veiculosData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const totalApolices = apolices.length;
  const apolicesVencendo = apolices.filter((a) => a.status === 'vencendo').length;
  const totalVeiculos = veiculos.length;
  const valorTotal = apolices.reduce((sum, a) => sum + (Number(a.valor) || 0), 0);

  const getStatusColor = (status: string) => {
    if (status === 'vencida') return 'text-red-500 bg-red-500/10';
    if (status === 'vencendo') return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  const exportarCSV = () => {
    if (apolices.length === 0) return;
    const headers = ['Número', 'Tipo', 'Valor', 'Veículo', 'Início', 'Fim', 'Status'];
    const linhas = apolices.map(a => [
      a.numeroApolice,
      a.tipoSeguro,
      a.valor,
      `${a.veiculo?.marca || ''} ${a.veiculo?.modelo || ''}`.trim(),
      a.dataInicio,
      a.dataFim,
      a.status
    ].join(','));
    const csv = [headers.join(','), ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apolices.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusLabel = (status: string, diasRestantes: number) => {
    if (status === 'vencida') return 'Vencida';
    if (status === 'vencendo') return `Vence em ${diasRestantes}d`;
    return 'Ativa';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e24f10]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Bem-vindo de volta, {user?.nome || 'usuário'}!</p>
          </div>
          <button
            onClick={exportarCSV}
            disabled={apolices.length === 0}
            className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-5 h-5" /> Exportar CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Apólices */}
          <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] p-6 hover:border-[#e24f10] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total de Apólices</p>
                <p className="text-3xl font-bold text-white">{totalApolices}</p>
              </div>
              <div className="bg-[#e24f10]/10 p-4 rounded-full">
                <Shield className="w-8 h-8 text-[#e24f10]" />
              </div>
            </div>
          </div>

          {/* Total de Veículos */}
          <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] p-6 hover:border-[#e24f10] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total de Veículos</p>
                <p className="text-3xl font-bold text-white">{totalVeiculos}</p>
              </div>
              <div className="bg-[#e24f10]/10 p-4 rounded-full">
                <Car className="w-8 h-8 text-[#e24f10]" />
              </div>
            </div>
          </div>

          {/* Apólices Vencendo */}
          <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-yellow-500/30 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Vencendo em 30 dias</p>
                <p className="text-3xl font-bold text-yellow-500">{apolicesVencendo}</p>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Valor Total */}
          <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] p-6 hover:border-[#e24f10] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Valor Total/mês</p>
                <p className="text-3xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(valorTotal)}
                </p>
              </div>
              <div className="bg-[#e24f10]/10 p-4 rounded-full">
                <TrendingUp className="w-8 h-8 text-[#e24f10]" />
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Vencimentos */}
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Próximos Vencimentos</h2>

          {apolices.filter((a) => a.status !== 'ativa').length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-green-500/20 mx-auto mb-4" />
              <p className="text-gray-400">Todas as suas apólices estão ativas e em dia!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apolices
                .filter((a) => a.status !== 'ativa')
                .map((apolice) => (
                  <div
                    key={apolice.id}
                    className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-[#333] hover:border-[#e24f10]/50 transition-all"
                  >
                    <div className="flex items-center gap-4 grow">
                      <div className="w-12 h-12 bg-[#e24f10]/10 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-[#e24f10]" />
                      </div>
                      <div className="grow">
                        <p className="font-semibold text-white">
                          {apolice.veiculo?.marca} {apolice.veiculo?.modelo}
                        </p>
                        <p className="text-xs text-gray-500">
                          Apólice #{apolice.numeroApolice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          Vence em: <span className="text-white font-semibold">
                            {formatDate(apolice.dataFim)}
                          </span>
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(apolice.status)}`}>
                        {getStatusLabel(apolice.status, apolice.diasRestantes)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Resumo de Apólices */}
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#333] p-6">
          <h2 className="text-xl font-bold mb-6">Todas as Apólices</h2>

          {apolices.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-[#e24f10]/20 mx-auto mb-4" />
              <p className="text-gray-400">Você ainda não possui apólices contratadas.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {apolices.map((apolice) => (
                <div
                  key={apolice.id}
                  className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-[#333] hover:border-[#e24f10]/50 transition-all"
                >
                  <div className="flex items-center gap-4 grow">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      apolice.status === 'vencida' ? 'bg-red-500/10' :
                      apolice.status === 'vencendo' ? 'bg-yellow-500/10' :
                      'bg-green-500/10'
                    }`}>
                      <Car className={`w-6 h-6 ${
                        apolice.status === 'vencida' ? 'text-red-500' :
                        apolice.status === 'vencendo' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                    </div>
                    <div className="grow">
                      <p className="font-semibold text-white">
                        {apolice.veiculo?.marca} {apolice.veiculo?.modelo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {apolice.veiculo?.placa} • {apolice.tipoSeguro?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-[#e24f10]">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(apolice.valor)}
                      </p>
                      <p className="text-xs text-gray-500">por mês</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${getStatusColor(apolice.status)}`}>
                      {getStatusLabel(apolice.status, apolice.diasRestantes)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
