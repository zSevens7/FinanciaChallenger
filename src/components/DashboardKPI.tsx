import FloatingBox from "./FloatingBox";

type DashboardKPIProps = {
  title: string;
  value: string;
  period: string;
};

const DashboardKPI = ({ title, value, period }: DashboardKPIProps) => {
  // Set color based on title
  const valueColor =
    title === "Total despesas"
      ? "text-red-500"
      : "text-green-500";

  return (
    <div className="flex flex-col w-full text-purple-500 text-xxl gap-2 max-w-96">
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
