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

// 🔑 Normalizador para alinhar dados do backend com o frontend
const transformarGasto = (g: any): Gasto | null => {
  if (!g) return null;

  const gasto: Gasto = {
    id: String(g.id ?? ""),
    descricao: g.descricao ?? "",
    preco: Number(g.valor ?? g.preco) || 0,
    data: typeof g.data === "string" ? g.data.split("T")[0] : "",
    categoria: g.categoria ?? "Outros",
    tipo: g.tipo ?? "outro",
    nome: g.nome ?? g.descricao ?? "",
    tipoDespesa: g.tipo_despesa ?? g.tipoDespesa ?? "outro",
  };

  if (!gasto.id || !gasto.data || !gasto.descricao || gasto.preco <= 0) return null;

  return gasto;
};

export const GastosProvider = ({ children }: { children: ReactNode }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [carregando, setCarregando] = useState(false); // ✅ flag para evitar looping

  const loadGastos = async () => {
    if (carregando) return;
    setCarregando(true);
    console.log("🔄 Carregando gastos...");

    try {
      const response = await api.get<any[]>("/gastos/");
      const gastosValidos = response.data
        .map(transformarGasto)
        .filter((g): g is Gasto => g !== null);

      setGastos(gastosValidos);
    } catch (err) {
      console.error("Erro ao carregar gastos do backend:", err);
      setGastos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    loadGastos();
  }, []);

  const refreshGastos = async () => {
    await loadGastos();
  };

  const addGasto = async (g: Omit<Gasto, "id">) => {
    if (!g.data || !g.descricao || g.preco <= 0 || !g.categoria) {
      console.warn("Tentativa de adicionar gasto inválido:", g);
      throw new Error("Dados do gasto inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const payload = {
        ...g,
        valor: g.preco,
        tipo_despesa: g.tipoDespesa,
      };

      const response = await api.post("/gastos/", payload);
      const gastoTransformado = transformarGasto(response.data);

      if (gastoTransformado) {
        setGastos((prev) => [...prev, gastoTransformado]);
      } else {
        console.warn("Gasto inválido retornado do backend:", response.data);
        await refreshGastos();
      }
    } catch (err) {
      console.error("Erro ao adicionar gasto:", err);
      throw err;
    }
  };

  const updateGasto = async (id: string, updatedGasto: Omit<Gasto, "id">) => {
    if (!updatedGasto.data || !updatedGasto.descricao || updatedGasto.preco <= 0 || !updatedGasto.categoria) {
      console.warn("Tentativa de atualizar gasto inválido:", updatedGasto);
      throw new Error("Dados do gasto inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const payload = {
        ...updatedGasto,
        valor: updatedGasto.preco,
        tipo_despesa: updatedGasto.tipoDespesa,
      };

      const response = await api.put(`/gastos/${id}`, payload);
      const gastoAtualizado = transformarGasto(response.data);

      if (gastoAtualizado) {
        setGastos((prev) => prev.map((g) => (g.id === id ? gastoAtualizado : g)));
      } else {
        console.warn("Gasto inválido após atualização:", response.data);
        await refreshGastos();
      }
    } catch (err) {
      console.error("Erro ao atualizar gasto:", err);
      throw err;
    }
  };

  const deleteGasto = async (id: string) => {
    try {
      await api.delete(`/gastos/${id}`);
      setGastos((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
      throw err;
    }
  };

  const removeGasto = (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
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