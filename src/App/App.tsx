import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Home } from '../pages/Home';
import { Layout } from './components/Layout';
import { Login } from '../pages/login/Login';
import { Cadastro } from '../pages/login/Cadastro';
import Seguros from '../pages/seguros/Seguros';
import { ProtectedRoute } from './ProtectedRouth';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas PÚBLICAS (Sem Navbar/Footer se preferir, ou dentro do Layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Rotas PROTEGIDAS */}
            <Route 
              path="/seguros" 
              element={
                <ProtectedRoute>
                  <Seguros />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}