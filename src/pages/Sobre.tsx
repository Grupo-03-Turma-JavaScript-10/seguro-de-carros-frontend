import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, Award, Clock, HeadphonesIcon } from "lucide-react";
import { ImageWithFallback } from "../App/components/figma/imageWithFallback";
import { useNavigate } from "react-router-dom";

export function Sobre() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" 
            alt="Equipe AutoGuard" 
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
            SOBRE A <span className="text-[#e24f10]">AUTOGUARD</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Protegendo o que é seu com excelência, tecnologia e compromisso desde o início.
          </motion.p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Nossa História</h2>
              <div className="h-1 w-20 bg-[#e24f10] mb-6"></div>
              <p className="text-gray-400 mb-4 text-lg leading-relaxed">
                A AutoGuard nasceu com uma missão clara: oferecer seguros de veículos de alta qualidade 
                com atendimento humanizado e tecnologia de ponta. Acreditamos que proteger o seu patrimônio 
                vai além de um contrato – é estabelecer uma relação de confiança.
              </p>
              <p className="text-gray-400 mb-4 text-lg leading-relaxed">
                Ao longo dos anos, nos tornamos referência no mercado de seguros automotivos, 
                sempre priorizando a satisfação dos nossos clientes e investindo em inovação para 
                garantir a melhor experiência possível.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Hoje, protegemos milhares de veículos em todo o país, mantendo nosso compromisso 
                com transparência, agilidade e suporte excepcional.
              </p>
            </div>
            <div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="História AutoGuard"
                className="rounded-2xl shadow-2xl border border-[#333]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nossos Pilares</h2>
            <div className="h-1 w-20 bg-[#e24f10] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group"
            >
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Missão</h3>
              <p className="text-gray-400 leading-relaxed">
                Oferecer proteção completa e acessível para veículos, garantindo tranquilidade 
                e segurança aos nossos clientes através de soluções inovadoras e atendimento excepcional.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group"
            >
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Visão</h3>
              <p className="text-gray-400 leading-relaxed">
                Ser a seguradora mais confiável e reconhecida do país, referência em qualidade, 
                tecnologia e satisfação do cliente no mercado de seguros automotivos.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333] hover:border-[#e24f10] transition-colors group"
            >
              <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#e24f10] transition-colors">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Valores</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#e24f10] rounded-full mt-2"></div>
                  <span>Integridade e transparência</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#e24f10] rounded-full mt-2"></div>
                  <span>Compromisso com o cliente</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#e24f10] rounded-full mt-2"></div>
                  <span>Inovação constante</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#e24f10] rounded-full mt-2"></div>
                  <span>Excelência no atendimento</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">O que nos torna únicos</h2>
            <div className="h-1 w-20 bg-[#e24f10] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Atendimento 24/7</h4>
              <p className="text-gray-400 text-sm">
                Suporte disponível todos os dias, a qualquer hora, para quando você mais precisar.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <HeadphonesIcon className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Suporte Especializado</h4>
              <p className="text-gray-400 text-sm">
                Equipe treinada e qualificada para resolver qualquer situação com agilidade.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Equipe Apaixonada</h4>
              <p className="text-gray-400 text-sm">
                Time jovem e dedicado, focado em revolucionar o mercado de seguros.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Cobertura Nacional</h4>
              <p className="text-gray-400 text-sm">
                Assistência em todo território nacional, onde quer que você esteja.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Processos Digitais</h4>
              <p className="text-gray-400 text-sm">
                Tudo pelo app: contratação, sinistros e acompanhamento sem burocracia.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] hover:border-[#e24f10] transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#e24f10]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Planos Flexíveis</h4>
              <p className="text-gray-400 text-sm">
                Opções personalizadas que se adaptam às suas necessidades e orçamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para proteger o seu veículo?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Faça uma simulação gratuita e descubra o plano ideal para você.
          </p>
          <a 
            onClick={() => navigate("/planos")}
            className="inline-block bg-[#e24f10] hover:bg-[#c23f0c] text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            COMEÇAR AGORA
          </a>
        </div>
      </section>
    </div>
  );
}
