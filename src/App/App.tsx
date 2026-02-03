import { BrowserRouter, Routes,Route} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ScrollToTop } from './ScrollToTop';
import Home from '../pages/Home';
import { Layout } from './components/Layout';
import { Login } from '../pages/login/Login';
import { Cadastro } from '../pages/login/Cadastro';
import { ProtectedRoute } from './ProtectedRouth';
import Seguros from '../pages/seguros/Seguros';
import { VeiculoList } from '../pages/Veiculos/VeiculoList';
import { VeiculoForm } from '../pages/Veiculos/VeiculoForm';
import { VeiculoDelet } from '../pages/Veiculos/VeiculoDelet';
import { Planos } from '../pages/Planos/Planos';
import { Dashboard } from '../pages/Dashboard';
import { Sobre } from '../pages/Sobre';
export default function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/login" element={<Login/>}/>     
              <Route path="/cadastro" element={<Cadastro/>}/>
              <Route path="/" element={<Home />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/seguros" element={
                <ProtectedRoute>
                  <Seguros />
                </ProtectedRoute>
              } />
              <Route path="/carros" element={
                <ProtectedRoute>
                  <VeiculoList />
                </ProtectedRoute>
              } />
              <Route path="/veiculos" element={
                <ProtectedRoute>
                  <VeiculoList />
                </ProtectedRoute>
              } />
              <Route path="/novo-veiculo" element={
                <ProtectedRoute>
                  <VeiculoForm />
                </ProtectedRoute>
              } />
              <Route path="/editar-veiculo/:id" element={
                <ProtectedRoute>
                  <VeiculoForm />
                </ProtectedRoute>
              } />
              <Route path="/deletar-veiculo/:id" element={
                <ProtectedRoute>
                  <VeiculoDelet />
                </ProtectedRoute>
              } />
              <Route path="/sobre" element={<Sobre />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}
