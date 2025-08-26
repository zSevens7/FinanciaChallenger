import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Gasto } from "../types"; 

// Interface do contexto de gastos
interface GastosContextType {
  gastos: Gasto[];
  addGasto: (g: Omit<Gasto, "id">) => Promise<void>;
  updateGasto: (id: string, g: Omit<Gasto, "id">) => Promise<void>;
  deleteGasto: (id: string) => Promise<void>;
  removeGasto: (id: string) => void;         // remove um gasto pelo ID (síncrono)
  removeAllGastos: () => void;               // limpa todos os gastos (síncrono)
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider = ({ children }: { children: ReactNode }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  // Carregar gastos do LocalStorage ao iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gastos");
      if (saved) {
        const parsedGastos: Gasto[] = JSON.parse(saved);
        setGastos(parsedGastos);
      }
    } catch (e) {
      console.error("Falha ao carregar gastos do LocalStorage", e);
      setGastos([]);
    }
  }, []);

  // Salvar gastos no LocalStorage sempre que houver mudança
  useEffect(() => {
    try {
      localStorage.setItem("gastos", JSON.stringify(gastos));
    } catch (e) {
      console.error("Falha ao salvar gastos no LocalStorage", e);
    }
  }, [gastos]);

  // Adicionar novo gasto
  const addGasto = async (g: Omit<Gasto, "id">) => {
    const newGasto: Gasto = { ...g, id: uuidv4() };
    setGastos(prev => [...prev, newGasto]);
  };

  // Atualizar gasto existente
  const updateGasto = async (id: string, updatedGasto: Omit<Gasto, "id">) => {
    setGastos(prev =>
      prev.map(gasto =>
        gasto.id === id ? { ...gasto, ...updatedGasto } : gasto
      )
    );
  };

  // Deletar gasto (async, caso queira futuramente conectar a backend)
  const deleteGasto = async (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  // Remover gasto (síncrono, para UI)
  const removeGasto = (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  // Remover todos os gastos
  const removeAllGastos = () => {
    setGastos([]);
  };

  return (
    <GastosContext.Provider value={{ 
      gastos, 
      addGasto, 
      updateGasto, 
      deleteGasto, 
      removeGasto, 
      removeAllGastos 
    }}>
      {children}
    </GastosContext.Provider>
  );
};

export const useGastos = () => {
  const ctx = useContext(GastosContext);
  if (!ctx) throw new Error("useGastos deve ser usado dentro de GastosProvider");
  return ctx;
};
