import { Link } from "react-router-dom";
import { Car, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-[#4c4b4b] text-[#e6e6e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Car className="h-8 w-8 text-[#e24f10]" />
              <span className="font-bold text-xl tracking-wider text-white">AUTOGUARD</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link to="/sobre" className="hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-sm font-medium transition-colors">Sobre</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className="hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                    <Link to="/Seguros" className="hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-sm font-medium transition-colors">Seguros</Link>
                    <Link to="/carros" className="hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-sm font-medium transition-colors">Carros</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:bg-[#1a1a1a] px-3 py-2 rounded-md transition-colors"
                >
                  <User className="h-5 w-5 text-[#e24f10]" />
                  <span className="text-sm font-medium text-white">{user?.nome}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#4c4b4b] rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-[#4c4b4b]">
                      <p className="text-sm font-medium text-white">{user?.nome}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#e6e6e6] hover:bg-[#2a2a2a] hover:text-[#e24f10] flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#e6e6e6] hover:text-[#e24f10] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-2 text-sm font-medium bg-[#e24f10] text-white rounded-md hover:bg-[#c84410] transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-base font-medium text-white">Home</Link>
            <Link to="/sobre" onClick={() => setIsOpen(false)} className="block hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-base font-medium text-white">Sobre</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-base font-medium text-gray-300">Dashboard</Link>
                <Link to="/seguros" onClick={() => setIsOpen(false)} className="block hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-base font-medium text-gray-300">Seguros</Link>
                <Link to="/carros" onClick={() => setIsOpen(false)} className="block hover:bg-[#1a1a1a] hover:text-[#e24f10] px-3 py-2 rounded-md text-base font-medium text-gray-300">Carros</Link>
                
                <div className="border-t border-[#4c4b4b] mt-2 pt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user?.nome}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-[#e24f10] flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-[#4c4b4b] mt-2 pt-2 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-[#e24f10]"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#e24f10] text-white hover:bg-[#c84410]"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}