// src/types/index.ts

// Tipo base para transações com valor monetário
interface TransacaoMonetaria {
  data: string;
  descricao: string;
  preco: number;
}

// Vendas (ganhos)
export interface Venda extends TransacaoMonetaria {
  id: number;
  tipoVenda: "salario" | "produto" | "servico";
}

// Gastos (despesas)
export interface Gasto extends TransacaoMonetaria {
  id: string;
  categoria: string;     // Ex: moradia, transporte
  tipoDespesa: string;   // Ex: fixo_essencial, extraordinario
}