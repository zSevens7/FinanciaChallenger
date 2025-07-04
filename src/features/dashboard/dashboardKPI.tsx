import React from 'react';
import FloatingBox from "../../components/FloatingBox";

type DashboardKPIProps = {
  title: string;
  value: string;
  period: string;
  valueColorClass?: string; // ← nova prop opcional
};

const DashboardKPI = ({ title, value, period, valueColorClass }: DashboardKPIProps) => {
  // Define cor padrão com base no título, se não houver sobrescrição via prop
  const defaultColor =
    title.toLowerCase().includes("despesa") ? "text-red-500" : "text-green-500";

  const valueColor = valueColorClass || defaultColor;

  return (
    <div className="flex flex-col w-full text-purple-600 text-xxl gap-2 max-w-96">
      {title}
      <FloatingBox>
        <div className="flex flex-row w-full justify-between items-center border-b pb-3 border-gray-100">
          <div className={`${valueColor} font-bold text-2xl`}>{value}</div>
          <div className="text-purple-300 text-sm">{period}</div>
        </div>
      </FloatingBox>
    </div>
  );
};

export default DashboardKPI;