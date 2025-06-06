import moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DashboardKPI from "../features/Dashboard/DashboardKPI";
import DashHistory from "../components/DashHistory/DashHistory";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    // Parent component for the dashboard page
    <div className="p-5 bg-gray-100 w-full h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 font-bold text-2xl text-purple-700 border-b border-purple-700 mb-7">
        Dashboard
      </div>
      {/* DATE SELECTOR */}
      <div className="flex-row flex w-full ">
        <div className="flex flex-col w-1/2 items-center gap-6">
          <DatePicker
            value={moment(startDate).format("LL")}
            selected={startDate}
            onChange={(date) => setStartDate(date || new Date())}
            customInput={
              <input className=" bg-purple-500 text-white font-medium rounded-lg p-4 flex items-center justify-center max-w-96 text-center cursor-pointer" />
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

        <div>
          <DashHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
