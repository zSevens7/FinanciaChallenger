import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Gasto } from "../types";
import api from "../services/api";

interface GastosContextType {
  gastos: Gasto[];
  addGasto: (g: Omit<Gasto, "id">) => Promise<void>;
  updateGasto: (id: string, g: Omit<Gasto, "id">) => Promise<void>;
  deleteGasto: (id: string) => Promise<void>;
  removeGasto: (id: string) => void;
  removeAllGastos: () => void;
  refreshGastos: () => Promise<void>;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider = ({ children }: { children: ReactNode }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const transformarGasto = (g: any): Gasto => ({
    ...g,
    preco: Number(g.valor) || 0,
    data: typeof g.data === "string" ? g.data.split("T")[0] : "",
  });

  const loadGastos = async () => {
    try {
      const response = await api.get<Gasto[]>("/gastos");
      setGastos(response.data.map(transformarGasto));
    } catch (err) {
      console.error("Erro ao carregar gastos do backend:", err);
      setGastos([]);
    }
  };

  useEffect(() => {
    loadGastos();
  }, []);

  const refreshGastos = async () => {
    await loadGastos();
  };

  const addGasto = async (g: Omit<Gasto, "id">) => {
    try {
      const response = await api.post<Gasto>("/gastos", g);
      setGastos(prev => [...prev, transformarGasto(response.data)]);
    } catch (err) {
      console.error("Erro ao adicionar gasto:", err);
    }
  };

  const updateGasto = async (id: string, updatedGasto: Omit<Gasto, "id">) => {
    try {
      await api.put(`/gastos/${id}`, updatedGasto);
      setGastos(prev =>
        prev.map(gasto =>
          gasto.id === id ? transformarGasto({ ...gasto, ...updatedGasto }) : gasto
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar gasto:", err);
    }
  };

  const deleteGasto = async (id: string) => {
    try {
      await api.delete(`/gastos/${id}`);
      setGastos(prev => prev.filter(gasto => gasto.id !== id));
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
    }
  };

  const removeGasto = (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  const removeAllGastos = () => {
    setGastos([]);
  };

  return (
    <GastosContext.Provider
      value={{
        gastos,
        addGasto,
        updateGasto,
        deleteGasto,
        removeGasto,
        removeAllGastos,
        refreshGastos,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
};

export const useGastos = () => {
  const ctx = useContext(GastosContext);
  if (!ctx) throw new Error("useGastos deve ser usado dentro de GastosProvider");
  return ctx;
};