import { Link } from "react-router-dom";
import { ShieldCheck, Zap, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1764693756785-5f16318d7f47?q=80&w=1080" 
            alt="Carro de luxo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-6">
            PROTEÇÃO <span className="text-[#e24f10]">PREMIUM</span>
          </motion.h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/seguros" className="bg-[#e24f10] hover:bg-[#c23f0c] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2">
              Ver Seguros <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors">
            <ShieldCheck className="w-12 h-12 text-[#e24f10] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Cobertura Completa</h3>
            <p className="text-gray-400">Proteção contra roubo, colisão e assistência 24h.</p>
          </div>
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors">
            <Zap className="w-12 h-12 text-[#e24f10] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Atendimento Rápido</h3>
            <p className="text-gray-400">Processos digitais sem burocracia pelo nosso app.</p>
          </div>
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors">
            <DollarSign className="w-12 h-12 text-[#e24f10] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Custo-Benefício</h3>
            <p className="text-gray-400">Planos flexíveis que cabem perfeitamente no seu bolso.</p>
          </div>
        </div>
      </section>
    </div>
  );
}