import { BrowserRouter, Routes,Route} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import {Navbar} from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Home } from '../pages/Home';
import { Layout } from './components/Layout';
import { Login } from '../pages/login/Login';
import { Cadastro } from '../pages/login/Cadastro';
export default function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/login" element={<Login/>}/>     
              <Route path="/cadastro" element={<Cadastro/>}/>
              <Route path="/" element={<Home />} /> 
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}
