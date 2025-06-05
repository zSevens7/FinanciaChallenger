import moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DashboardKPI from "../components/DashboardKPI";
import DashHistory from "../components/DashHistory/DashHistory";
import PageContainer from "../features/gastos/components/PageContainer";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    // Parent component for the dashboard page
    <PageContainer>
      {/* HEADER */}
      <div className="p-6 font-bold text-2xl text-purple-700 border-b border-purple-700 mb-7 ">
        Dashboard
      </div>
      {/* DATE SELECTOR */}
      <div className="flex-col md:flex-row flex w-full gap-8">
        <div className="flex flex-col items-center gap-6 w-full md:w-1/2">
          <DatePicker
            value={moment(startDate).format("LL")}
            selected={startDate}
            onChange={(date) => setStartDate(date || new Date())}
            customInput={
              <input className="GhostButton bg-transparent border border-purple-500 text-purple-500 font-semibold py-2 px-4 rounded hover:bg-purple-500 hover:text-white transition-colors duration-300 cursor-pointer" />
            }
          />

          {/* KPI CARDS */}
          <DashboardKPI
            title="Saldo Líquido"
            value="1.0000"
            period={moment(startDate).format("DD/MMM/YYYY")}
          />
          <DashboardKPI
            title="Total despesas"
            value="1.0000"
            period={moment(startDate).format("DD/MMM/YYYY")}
          />
          <DashboardKPI
            title="Total de vendas"
            value="1.0000"
            period={moment(startDate).format("DD/MMM/YYYY")}
          />
        </div>

        {/* TRANSACTION HISTORY */}

        <div className="flex flex-col  items-center w-full md:w-1/2">
          <DashHistory />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
