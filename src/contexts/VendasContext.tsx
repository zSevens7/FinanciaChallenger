import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";
import { VendaInput, Venda } from "../types/index";

interface VendasContextType {
  vendas: Venda[];
  addVenda: (vendaInput: VendaInput) => Promise<void>;
  updateVenda: (id: string, vendaInput: VendaInput) => Promise<void>;
  deleteVenda: (id: string) => Promise<void>;
  refreshVendas: () => Promise<void>;
}

const VendasContext = createContext<VendasContextType | undefined>(undefined);

export const VendasProvider = ({ children }: { children: ReactNode }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const loadVendas = async () => {
    try {
      const res = await api.get<{ vendas: Venda[] }>("/vendas");
      setVendas(res.data.vendas);
    } catch (err) {
      console.error("Erro ao carregar vendas do backend:", err);
    }
  };

  useEffect(() => {
    loadVendas();
  }, []);

  const addVenda = async (vendaInput: VendaInput) => {
    try {
      const res = await api.post<{ venda: Venda }>("/vendas", vendaInput);
      // Atualiza a lista local com a nova venda
      setVendas(prev => [...prev, res.data.venda]);
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
      throw err;
    }
  };

  const updateVenda = async (id: string, vendaInput: VendaInput) => {
    try {
      const res = await api.put<{ venda: Venda }>(`/vendas/${id}`, vendaInput);
      setVendas(prev => prev.map(v => (v.id === id ? res.data.venda : v)));
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      throw err;
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      await api.delete(`/vendas/${id}`);
      setVendas(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
      throw err;
    }
  };

  return (
    <VendasContext.Provider value={{ 
      vendas, 
      addVenda, 
      updateVenda, 
      deleteVenda,
      refreshVendas: loadVendas 
    }}>
      {children}
    </VendasContext.Provider>
  );
};

export const useVendas = () => {
  const context = useContext(VendasContext);
  if (!context) throw new Error("useVendas deve ser usado dentro de um VendasProvider");
  return context;
};