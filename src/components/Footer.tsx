import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#4c4b4b] text-[#e6e6e6] py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-[#e24f10] mb-4">AutoGuard Seguros</h3>
          <p className="text-sm text-gray-400">
            Protegendo seu caminho com tecnologia e segurança. A melhor escolha para o seu veículo.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#e24f10]" /> (51) 8249-2416</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#e24f10]" /> g3js10@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#e24f10]" /> Porto-Alegre-RS</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Redes Sociais</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#e24f10] transition-colors"><Instagram /></a>
            <a href="#" className="text-gray-400 hover:text-[#e24f10] transition-colors"><Facebook /></a>
            <a href="#" className="text-gray-400 hover:text-[#e24f10] transition-colors"><Twitter /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-600 mt-10">
        © 2026 AutoGuard Seguros. Todos os direitos reservados.
      </div>
    </footer>
  );
}
