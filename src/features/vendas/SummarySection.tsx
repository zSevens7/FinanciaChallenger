// src/features/vendas/SummarySection.tsx

interface SummarySectionProps {
  totalAcumulado: number;
  title?: string; // <-- Adiciona a prop 'title', tornando-a opcional
  // Adicionar uma prop para a cor do valor, se você quiser que seja configurável
  // valueColorClass?: string; // Ex: 'text-green-600' ou 'text-purple-900'
}

export const SummarySection = ({
  totalAcumulado,
  title = "Total Acumulado", // <-- Define um valor padrão para 'title'
  // valueColorClass = "text-purple-900" // <-- Valor padrão para a cor, ou use um fixo
}: SummarySectionProps) => (
  <section className="mb-8 p-4 bg-purple-50 rounded-lg shadow text-center">
    <h2 className="text-xl font-semibold text-[#964bca]">
      {title} {/* Usa a prop 'title' aqui */}
    </h2>
    <p className="text-3xl font-bold text-purple-900 mt-1"> {/* Altere a cor do texto para purple-900 (ou green-500 se preferir verde para lucro) */}
    {/* OU use valueColorClass se você implementá-lo: */}
    {/* <p className={`text-3xl font-bold ${valueColorClass} mt-1`}> */}
      R$ {totalAcumulado.toFixed(2)}
    </p>
  </section>
);