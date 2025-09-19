// src/contexts/VendasContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../services/api";
import { Venda, VendaInput } from "../types/index"; // Certifique-se de que VendaInput está exportado em types/index.ts

interface VendasContextType {
  vendas: Venda[];
  addVenda: (v: Omit<VendaInput, "valor">) => Promise<void>;
  updateVenda: (id: string, v: Omit<VendaInput, "valor">) => Promise<void>;
  deleteVenda: (id: string) => Promise<void>;
  refreshVendas: () => Promise<void>;
}

const VendasContext = createContext<VendasContextType | undefined>(undefined);

// 🔑 Normalizador para alinhar dados do backend com o frontend
const transformarVenda = (v: any): Venda | null => {
  if (!v) return null;

  const preco = Number(v.valor) || 0;
  const venda: Venda = {
    id: String(v.id ?? ""),
    descricao: v.descricao ?? "",
    preco,
    data: typeof v.data === "string" ? v.data.split("T")[0] : "",
    tipoVenda: (v.tipo_venda ?? "produto") as Venda["tipoVenda"],
    comentario: v.comentario ?? "", // opcional
  };

  if (!venda.id || !venda.data || !venda.descricao || preco <= 0) return null;

  return venda;
};

export const VendasProvider = ({ children }: { children: ReactNode }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const loadVendas = async () => {
    try {
      const response = await api.get<any[]>("/vendas/");
      const vendasValidas = response.data
        .map(transformarVenda)
        .filter((v): v is Venda => v !== null);

      setVendas(vendasValidas);
    } catch (err) {
      console.error("Erro ao carregar vendas do backend:", err);
      setVendas([]);
    }
  };

  useEffect(() => {
    loadVendas();
  }, []);

  const refreshVendas = async () => {
    await loadVendas();
  };

  const addVenda = async (v: Omit<VendaInput, "valor">) => {
    if (!v.data || !v.descricao || v.preco <= 0 || !v.tipoVenda) {
      console.warn("Tentativa de adicionar venda inválida:", v);
      throw new Error("Dados da venda inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const payload = {
        ...v,
        valor: v.preco,
        tipo_venda: v.tipoVenda,
      };

      const response = await api.post("/vendas/", payload);
      const vendaTransformada = transformarVenda(response.data);

      if (vendaTransformada) {
        setVendas((prev) => [...prev, vendaTransformada]);
      } else {
        console.warn("Venda inválida retornada do backend:", response.data);
        await refreshVendas();
      }
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
      throw err;
    }
  };

  const updateVenda = async (id: string, updatedVenda: Omit<VendaInput, "valor">) => {
    if (!updatedVenda.data || !updatedVenda.descricao || updatedVenda.preco <= 0 || !updatedVenda.tipoVenda) {
      console.warn("Tentativa de atualizar venda inválida:", updatedVenda);
      throw new Error("Dados da venda inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const payload = {
        ...updatedVenda,
        valor: updatedVenda.preco,
        tipo_venda: updatedVenda.tipoVenda,
      };

      const response = await api.put(`/vendas/${id}`, payload);
      const vendaAtualizada = transformarVenda(response.data);

      if (vendaAtualizada) {
        setVendas((prev) => prev.map((v) => (v.id === id ? vendaAtualizada : v)));
      } else {
        console.warn("Venda inválida após atualização:", response.data);
        await refreshVendas();
      }
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      throw err;
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      await api.delete(`/vendas/${id}`);
      setVendas((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
      throw err;
    }
  };

  return (
    <VendasContext.Provider
      value={{
        vendas,
        addVenda,
        updateVenda,
        deleteVenda,
        refreshVendas,
      }}
    >
      {children}
    </VendasContext.Provider>
  );
};

export const useVendas = () => {
  const ctx = useContext(VendasContext);
  if (!ctx) throw new Error("useVendas deve ser usado dentro de VendasProvider");
  return ctx;
};
