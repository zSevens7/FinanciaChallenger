import React from "react";
import FloatingBox from "../../components/FloatingBox";

type DashboardKPIProps = {
  title: string;
  value?: string | number | null;
  period?: string;
  valueColorClass?: string;
};

const DashboardKPI = ({
  title,
  value = "—",
  period = "",
  valueColorClass,
}: DashboardKPIProps) => {
  // cor padrão baseada no título (tratando plurais/variações)
  const lower = title.toLowerCase();
  const defaultColor = lower.includes("despesa") || lower.includes("despesas") || lower.includes("custo")
    ? "text-red-600"
    : lower.includes("invest")
    ? "text-blue-600"
    : "text-green-600";

  const valueColor = valueColorClass || defaultColor;

  // garante que números apareçam com duas casas (se forem number)
  const formattedValue =
    typeof value === "number" ? value.toFixed(2) : value ?? "—";

  return (
    <div
      role="region"
      aria-label={title}
      className="w-full max-w-[24rem] flex flex-col gap-2"
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>

      <FloatingBox>
        <div className="flex items-center justify-between gap-4 p-3">
          <div className={`font-bold text-2xl tracking-tight ${valueColor}`}>
            {formattedValue}
          </div>

          {period ? (
            <div className="text-sm text-gray-400">{period}</div>
          ) : (
            <div className="text-sm text-gray-300">Geral</div>
          )}
        </div>
      </FloatingBox>
    </div>
  );
};

export default DashboardKPI;
