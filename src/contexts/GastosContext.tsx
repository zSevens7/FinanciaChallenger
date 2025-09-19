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

// Função para validar se um gasto é válido
const isGastoValido = (g: Gasto): boolean => {
  return !!(
    g.id &&
    g.data &&
    g.descricao &&
    g.descricao.trim() !== "" &&
    g.preco > 0 &&
    g.categoria &&
    g.categoria.trim() !== "" &&
    g.tipo &&
    g.tipo.trim() !== ""
  );
};

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
    tipoDespesa: g.tipo_despesa ?? g.tipoDespesa ?? "outro", // valor padrão
  };

  return gasto; // <--- sempre retorna objeto, não chama refreshGastos
};



export const GastosProvider = ({ children }: { children: ReactNode }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const loadGastos = async () => {
    try {
      const response = await api.get<any[]>("/gastos");

      const gastosValidos = response.data
        .map(transformarGasto)
        .filter((g): g is Gasto => g !== null);

      setGastos(gastosValidos);
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
    if (!g.data || !g.descricao || g.preco <= 0 || !g.categoria || !g.tipo) {
      console.warn("Tentativa de adicionar gasto inválido:", g);
      throw new Error("Dados do gasto inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const response = await api.post("/gastos", g);
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
    if (
      !updatedGasto.data ||
      !updatedGasto.descricao ||
      updatedGasto.preco <= 0 ||
      !updatedGasto.categoria ||
      !updatedGasto.tipo
    ) {
      console.warn("Tentativa de atualizar gasto com dados inválidos:", updatedGasto);
      throw new Error("Dados do gasto inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const response = await api.put(`/gastos/${id}`, updatedGasto);
      const gastoAtualizado = transformarGasto(response.data);

      if (gastoAtualizado) {
        setGastos((prev) =>
          prev.map((gasto) => (gasto.id === id ? gastoAtualizado : gasto))
        );
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
      setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
      throw err;
    }
  };

  const removeGasto = (id: string) => {
    setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
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

export const useGastosValidos = () => {
  const { gastos, ...actions } = useGastos();

  const gastosValidos = React.useMemo(() => {
    return gastos.filter(isGastoValido);
  }, [gastos]);

  return { gastos: gastosValidos, ...actions };
};
