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
              <input className="w-full sm:w-auto bg-[#964bca] text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100" />
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
