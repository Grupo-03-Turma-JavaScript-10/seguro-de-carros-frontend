import { BrowserRouter, Routes,Route} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import {Navbar} from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Home } from '../pages/Home';
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />          
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
