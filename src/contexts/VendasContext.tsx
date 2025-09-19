import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Venda } from "../types";
import api from "../services/api";

interface VendasContextType {
  vendas: Venda[];
  addVenda: (v: Omit<Venda, "id">) => Promise<void>;
  updateVenda: (id: string, v: Omit<Venda, "id">) => Promise<void>;
  deleteVenda: (id: string) => Promise<void>;
  removeVenda: (id: string) => void;
  removeAllVendas: () => void;
  refreshVendas: () => Promise<void>;
}

const VendasContext = createContext<VendasContextType | undefined>(undefined);

// Função para validar se uma venda é válida
const isVendaValida = (v: Venda): boolean => {
  return !!(
    v.id &&
    v.data &&
    v.descricao &&
    v.descricao.trim() !== '' &&
    v.preco > 0 &&
    v.tipoVenda &&
    v.tipoVenda.trim() !== ''
  );
};

export const VendasProvider = ({ children }: { children: ReactNode }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const transformarVenda = (v: any): Venda | null => {
    try {
      // Verifica se o objeto v é válido
      if (!v) {
        console.error("Objeto venda é undefined ou null");
        return null;
      }

      // Garantir que tipoVenda seja um dos valores permitidos
      const tipoVendaValido = ["salario", "produto", "servico"].includes(v.tipoVenda || v.tipo_venda)
        ? (v.tipoVenda || v.tipo_venda)
        : "servico"; // Valor padrão

      const preco = Number(v.preco) || Number(v.valor) || 0;
      
      const vendaTransformada: Venda = {
        id: v.id || '',
        descricao: v.descricao || '',
        preco: preco,
        data: typeof v.data === "string" ? v.data.split("T")[0] : '',
        tipoVenda: tipoVendaValido,
        // REMOVIDAS todas as propriedades que não existem no tipo Venda
        // nomeCliente: v.nomeCliente || v.nome_cliente || '',
        // tipoCurso: v.tipoCurso || v.tipo_curso || '',
        // comentario: v.comentario || '',
      };

      // Retorna null se a venda não for válida
      return isVendaValida(vendaTransformada) ? vendaTransformada : null;
    } catch (error) {
      console.error("Erro ao transformar venda:", error, v);
      return null;
    }
  };

  const loadVendas = async () => {
    try {
      const response = await api.get<any[]>("/vendas");
      
      // Filtrar vendas válidas
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

  const addVenda = async (v: Omit<Venda, "id">) => {
    // Validar antes de enviar para o backend
    if (!v.data || !v.descricao || v.preco <= 0 || !v.tipoVenda) {
      console.warn("Tentativa de adicionar venda inválida:", v);
      throw new Error("Dados da venda inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      const response = await api.post<Venda>("/vendas", v);
      const vendaTransformada = transformarVenda(response.data);
      
      if (vendaTransformada) {
        setVendas(prev => [...prev, vendaTransformada]);
      } else {
        console.warn("Venda inválida retornada do backend:", response.data);
        await refreshVendas();
      }
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
      throw err;
    }
  };

  const updateVenda = async (id: string, updatedVenda: Omit<Venda, "id">) => {
    // Validar antes de enviar para o backend
    if (!updatedVenda.data || !updatedVenda.descricao || updatedVenda.preco <= 0 || 
        !updatedVenda.tipoVenda) {
      console.warn("Tentativa de atualizar venda com dados inválidos:", updatedVenda);
      throw new Error("Dados da venda inválidos. Preencha todos os campos obrigatórios.");
    }

    try {
      await api.put(`/vendas/${id}`, updatedVenda);
      
      // Atualizar apenas se os dados forem válidos
      const vendaAtualizada = transformarVenda({ id, ...updatedVenda });
      if (vendaAtualizada) {
        setVendas(prev =>
          prev.map(venda =>
            venda.id === id ? vendaAtualizada : venda
          )
        );
      } else {
        console.warn("Venda inválida após atualização:", { id, ...updatedVenda });
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
      setVendas(prev => prev.filter(venda => venda.id !== id));
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
      throw err;
    }
  };

  const removeVenda = (id: string) => {
    setVendas(prev => prev.filter(venda => venda.id !== id));
  };

  const removeAllVendas = () => {
    setVendas([]);
  };

  return (
    <VendasContext.Provider
      value={{
        vendas,
        addVenda,
        updateVenda,
        deleteVenda,
        removeVenda,
        removeAllVendas,
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

// Hook personalizado para usar apenas vendas válidas
export const useVendasValidas = () => {
  const { vendas, ...actions } = useVendas();
  
  // Filtrar vendas válidas
  const vendasValidas = React.useMemo(() => {
    return vendas.filter(isVendaValida);
  }, [vendas]);
  
  return { vendas: vendasValidas, ...actions };
};