import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TcgChatWidget from './components/TcgChatWidget'; // Importacion del componente global de IA

function App() {
  return (
    <>
      <Header />
      
      {/* El Outlet maneja las paginas que van cambiando segun la ruta */}
      <Outlet />
      
      <Footer />

      {/* El Chat Widget permanece flotando de forma fija en la esquina inferior derecha */}
      <TcgChatWidget />
    </>
  );
}

export default App;