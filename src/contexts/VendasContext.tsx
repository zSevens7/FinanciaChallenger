import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Novo tipo VendaInput compatível com types.ts
export type TipoVenda = "salario" | "produto" | "servico";

export interface VendaInput {
  data: string;
  descricao: string;
  preco: number;
  tipoVenda: TipoVenda;
}

export interface Venda extends VendaInput {
  id: string;
}

interface VendasContextType {
  vendas: Venda[];
  addVenda: (venda: VendaInput) => void;
  deleteVenda: (id: string) => void;
  updateVenda: (id: string, updatedVenda: VendaInput) => void;
}

const VendasContext = createContext<VendasContextType | undefined>(undefined);

export const VendasProvider = ({ children }: { children: ReactNode }) => {
  const [vendas, setVendas] = useState<Venda[]>(() => {
    try {
      const saved = localStorage.getItem("vendas");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem("vendas", JSON.stringify(vendas));
  }, [vendas]);

  const addVenda = (vendaInput: VendaInput) => {
    const newVenda: Venda = {
      id: uuidv4(),
      data: vendaInput.data,
      descricao: vendaInput.descricao,
      preco: vendaInput.preco,
      tipoVenda: vendaInput.tipoVenda,
    };
    setVendas(prev => [...prev, newVenda]);
  };

  const deleteVenda = (id: string) => {
    setVendas(prev => prev.filter(v => v.id !== id));
  };

  const updateVenda = (id: string, updatedVenda: VendaInput) => {
    setVendas(prev =>
      prev.map(v => 
        v.id === id
          ? { id: v.id, data: updatedVenda.data, descricao: updatedVenda.descricao, preco: updatedVenda.preco, tipoVenda: updatedVenda.tipoVenda }
          : v
      )
    );
  };

  return (
    <VendasContext.Provider value={{ vendas, addVenda, deleteVenda, updateVenda }}>
      {children}
    </VendasContext.Provider>
  );
};

export const useVendas = () => {
  const context = useContext(VendasContext);
  if (!context) throw new Error("useVendas deve ser usado dentro de um VendasProvider");
  return context;
};
