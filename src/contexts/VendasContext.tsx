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

      // Garante que cada venda tenha 'preco' definido (para frontend)
      const vendasComPreco = res.data.vendas.map(v => ({
        ...v,
        preco: v.preco ?? v.valor ?? 0,
      }));

      setVendas(vendasComPreco);
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

      const novaVenda = {
        ...res.data.venda,
        preco: res.data.venda.preco ?? res.data.venda.valor ?? 0,
      };

      setVendas(prev => [...prev, novaVenda]);
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
      throw err;
    }
  };

  const updateVenda = async (id: string, vendaInput: VendaInput) => {
    try {
      const res = await api.put<{ venda: Venda }>(`/vendas/${id}`, vendaInput);

      const vendaAtualizada = {
        ...res.data.venda,
        preco: res.data.venda.preco ?? res.data.venda.valor ?? 0,
      };

      setVendas(prev => prev.map(v => (v.id === id ? vendaAtualizada : v)));
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
      refreshVendas: loadVendas,
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
