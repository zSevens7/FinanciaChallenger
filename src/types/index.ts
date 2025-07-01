// src/types/index.ts

export interface Venda {
    id: number;
    data: string;
    tipoCurso: string;
    nomeCliente: string;
    email: string;
    telefone: string;
    valorBruto: number | null;
    desconto: number | null;
    imposto: number | null;
    comissao: number | null;
    valorFinal: number | null;
}

// Sua interface Gasto precisa ter 'data' e 'preco', e outras propriedades que você usa
export interface Gasto {
    id: string; 
    data: string; 
    descricao: string; 
    categoria: string; 
    tipoDespesa: string; 
    preco: number; 
    // Adicione aqui qualquer outra propriedade que um 'Gasto' possa ter
}