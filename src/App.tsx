import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Gastos from "./pages/Gastos";
import Vendas from "./pages/Vendas";

function App() {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/vendas" element={<Vendas />} />
        </Routes>
      </Header>
    </BrowserRouter>
  );
}

export default App;
