import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import GastosPage from "./pages/GastosPage";
import Vendas from "./pages/Vendas";
import { HeaderProvider } from "./contexts/HeaderContext"; // Importa o provedor do contexto

function App() {
  return (
    <BrowserRouter>
      {/* O HeaderProvider envolve todo o aplicativo para que o contexto esteja disponível */}
      <HeaderProvider>
        {/* O Header principal agora consome o contexto */}
        <Header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gastos" element={<GastosPage />} />
            <Route path="/vendas" element={<Vendas />} />
          </Routes>
        </Header>
      </HeaderProvider>
    </BrowserRouter>
  );
}

export default App;
