export interface Transaction {
  id: string;
  data: string;
  type: 'expense' | 'sale';
  amount?: number;
  descricao?: string;
  comentario?: string;
  tipo?: string;
  nomeCliente?: string;
  tipoCurso?: string;
}
