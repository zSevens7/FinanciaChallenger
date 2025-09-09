// src/contexts/VendasContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api"; // axios configurado com baseURL e JWT
import { VendaInput, Venda } from "../types/index";

interface VendasContextType {
  vendas: Venda[];
  addVenda: (vendaInput: VendaInput) => Promise<void>;
  updateVenda: (id: string, vendaInput: VendaInput) => Promise<void>;
  deleteVenda: (id: string) => Promise<void>;
}

const VendasContext = createContext<VendasContextType | undefined>(undefined);

export const VendasProvider = ({ children }: { children: ReactNode }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Carregar vendas do backend ao iniciar
  useEffect(() => {
    const loadVendas = async () => {
      try {
        const res = await api.get<{ vendas: Venda[] }>("/vendas");
        setVendas(res.data.vendas);
      } catch (err) {
        console.error("Erro ao carregar vendas do backend:", err);
      }
    };
    loadVendas();
  }, []);

  const addVenda = async (vendaInput: VendaInput) => {
    try {
      const res = await api.post<{ venda: Venda }>("/vendas", vendaInput);
      setVendas(prev => [...prev, res.data.venda]);
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
    }
  };

  const updateVenda = async (id: string, vendaInput: VendaInput) => {
    try {
      const res = await api.put<{ venda: Venda }>(`/vendas/${id}`, vendaInput);
      setVendas(prev => prev.map(v => (v.id === id ? res.data.venda : v)));
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      await api.delete(`/vendas/${id}`);
      setVendas(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
    }
  };

  return (
    <VendasContext.Provider value={{ vendas, addVenda, updateVenda, deleteVenda }}>
      {children}
    </VendasContext.Provider>
  );
};

export const useVendas = () => {
  const context = useContext(VendasContext);
  if (!context) throw new Error("useVendas deve ser usado dentro de um VendasProvider");
  return context;
};
