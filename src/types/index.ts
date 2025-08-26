// src/types/index.ts

// Tipo base para transações com valor monetário
interface TransacaoMonetaria {
  data: string;
  descricao: string;
  preco: number;
}

// Vendas (ganhos)
export interface Venda extends TransacaoMonetaria {
  id: string; // padronizar string, já que você usa uuid
  tipoVenda: "salario" | "produto" | "servico";
}

// Gastos (despesas)
export interface Gasto extends TransacaoMonetaria {
  id: string;              // ✅ string (uuid)
  categoria: string;       // Ex: moradia, transporte
  tipoDespesa: string;     // Ex: fixo_essencial, extraordinario
  nome?: string;           // ✅ opcional, se precisar
  tipo?: string;           // ✅ opcional, se precisar
}
