// src/hooks/useLocalStorageData.ts
import { useState, useEffect, useCallback } from 'react'; // <--- Adicione useCallback aqui

// === INTERFACES COMPLETAS PARA GASTO E VENDA ===
// BASEADO NO SEU USO E NAS SUAS PÁGINAS DE ORIGEM
export interface Gasto {
    id: string; // ou number, dependendo de como você gera o ID
    data: string; // Formato "yyyy-mm-dd"
    preco: number; // O valor do gasto
    categoria?: string;
    descricao?: string;
    tipoDespesa?: string;
    comentario?: string;
}

export interface Venda {
    id: number; // ou string
    data: string;
    tipoCurso: string;
    nomeCliente: string;
    email?: string;
    telefone?: string;
    valorBruto: number | null;
    desconto: number | null;
    imposto: number | null;
    comissao: number | null;
    valorFinal: number | null;
    comentario?: string;
}

interface LocalStorageData {
    gastos: Gasto[];
    vendas: Venda[];
}

export const useLocalStorageData = () => {
    const [data, setData] = useState<LocalStorageData>({
        gastos: [],
        vendas: [],
    });

    // Função readLocalStorage não precisa ser memoizada pois não é uma dependência direta de useEffect
    const readLocalStorage = () => {
        try {
            const storedGastos = JSON.parse(localStorage.getItem('gastos') || '[]') as Gasto[];
            const storedVendas = JSON.parse(localStorage.getItem('vendas') || '[]') as Venda[];
            setData({
                gastos: storedGastos,
                vendas: storedVendas,
            });
        } catch (error) {
            console.error("Erro ao ler dados do localStorage:", error);
            setData({ gastos: [], vendas: [] });
        }
    };

    // Memoize refreshAllData para garantir que sua referência não mude em cada render
    const refreshAllData = useCallback(() => {
        readLocalStorage();
    }, []); // <--- Array de dependências vazio, pois readLocalStorage não muda e não é closure sobre 'data'

    useEffect(() => {
        readLocalStorage(); // Carrega dados na montagem inicial

        const handleStorageChange = (event: StorageEvent) => {
            // Este console.log é para depuração. Você pode removê-lo depois.
            console.log("Storage event fired, key:", event.key);
            if (event.key === 'gastos' || event.key === 'vendas' || event.key === null) {
                // event.key === null ocorre quando o localStorage é LIMPO
                refreshAllData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refreshAllData]); // refreshAllData é uma dependência estável agora

    return {
        gastos: data.gastos,
        vendas: data.vendas,
        refreshAllData,
    };
};