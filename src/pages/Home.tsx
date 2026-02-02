import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { ImageWithFallback } from "../App/components/figma/imageWithFallback";

  function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
  
    const handleVerSeguros = () => {
      if (isAuthenticated) {
        navigate("/seguros");
      } else {
        navigate("/login");
      }
    };
  
    return (
      <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1764693756785-5f16318d7f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBibGFjayUyMGNhciUyMGRhcmslMjBiYWNrZ3JvdW5kJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzY5ODA0MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="Carro de luxo em estúdio escuro" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            PROTEÇÃO <span className="text-[#e24f10]">PREMIUM</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Segurança total para o seu veículo com a tecnologia e suporte que você merece. Conheça nossos planos exclusivos.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleVerSeguros}
              className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Ver Seguros <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/planos" className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
              Nossos Planos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Por que escolher a <span className="text-[#e24f10]">AutoGuard</span>?</h2>
            <div className="h-1 w-20 bg-[#e24f10] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group">
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cobertura Completa</h3>
              <p className="text-gray-400">Proteção contra roubo, furto, colisão e danos a terceiros com assistência 24h.</p>
            </div>
            
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group">
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Atendimento Rápido</h3>
              <p className="text-gray-400">Processos digitais e sem burocracia para você resolver tudo pelo app.</p>
            </div>
            
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group">
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Melhor Custo-Benefício</h3>
              <p className="text-gray-400">Planos flexíveis que cabem no seu bolso sem abrir mão da qualidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
             <ImageWithFallback 
                src="https://images.unsplash.com/photo-1673132992772-78a21138dfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvciUyMGRhcmslMjBkZXRhaWxzfGVufDF8fHx8MTc2OTgwNDE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Interior de carro moderno"
                className="rounded-2xl shadow-2xl border border-[#333]"
             />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tecnologia a favor da sua segurança</h2>
            <p className="text-gray-400 mb-6 text-lg">
              Utilizamos a mais alta tecnologia para monitorar e proteger seu veículo. Nossos planos incluem rastreamento via satélite e bloqueio remoto em caso de roubo.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-[#e24f10] rounded-full"></div>
                Monitoramento 24h
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-[#e24f10] rounded-full"></div>
                Assistência Guincho ilimitada
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-[#e24f10] rounded-full"></div>
                Carro reserva garantido
              </li>
            </ul>
            <Link to="/planos" className="text-[#e24f10] font-bold hover:text-white transition-colors inline-flex items-center gap-2">
              CONHEÇA OS PLANOS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
