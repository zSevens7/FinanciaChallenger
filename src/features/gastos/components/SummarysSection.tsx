interface SummarySectionProps {
  totalAcumulado: number;
}

export const SummarySection = ({ totalAcumulado }: SummarySectionProps) => (
  <section className="mb-8 p-4 bg-purple-50 rounded-lg shadow text-center"> 
    <h2 className="text-xl font-semibold text-[#964bca]"> 
      Total de Despesas
    </h2>
    <p className="text-3xl font-bold text-red-500 mt-1"> 
      R$ {totalAcumulado.toFixed(2)}
    </p>
  </section>
);