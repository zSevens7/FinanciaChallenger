import { useState } from "react";
import FloatingBox from "../FloatingBox";
import GhostButton from "../GhostButton";
import HistorySelectButton from "./subcomponents/HistorySelectButton";
import transactionHistory from "../../assets/data/transactions.json";
const desteMes = transactionHistory["2025-06"];

const HistoryCard = ({
  data_operacao,
  comentario,
  nome_cliente,
  tipo,
  tipo_transacao,
  valor,
}) => {
  const getIcon = () => {
    switch (tipo) {
      

      default:
        return tipo;
        break;
    }
  };
  return (
    <div className="flex flex-row justify-between">
      <div>{getIcon()}</div>
      <div className="flex flex-col">
        <div>{comentario}</div>
        <div>{nome_cliente}</div>
      </div>
      <div className="flex flex-col">
        <div
          className={`${
            tipo_transacao === "entrada" ? "text-green-500" : "text-red-500"
          }`}
        >
          R$ {valor.toFixed(2).replace(".", ",")}
        </div>
        <div>{data_operacao}</div>
      </div>
    </div>
  );
};

const DashHistory = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const [verMais, setVerMais] = useState(false);

  const getData = () => {
    let finalData = [...desteMes];
    if (selectedTab === "Vendas") {
      finalData = finalData.filter((item) => item.tipo_transacao === "entrada");
    } else if (selectedTab === "Gastos") {
      finalData = finalData.filter((item) => item.tipo_transacao === "saída");
    }
    return finalData;
  };

  const data = verMais
    ? getData().map((item) => {
        return (
          <HistoryCard
            comentario={item.comentario}
            data_operacao={item.data_operacao}
            nome_cliente={item.nome_cliente}
            tipo_transacao={item.tipo_transacao}
            valor={item.valor}
            tipo={item.tipo}
          />
        );
      })
    : getData()
        .slice(0, 6)
        .map((item) => {
          return (
            <HistoryCard
              comentario={item.comentario}
              data_operacao={item.data_operacao}
              nome_cliente={item.nome_cliente}
              tipo_transacao={item.tipo_transacao}
              valor={item.valor}
              tipo={item.tipo}
            />
          );
        });

  return (
    <div>
      <div className="flex flex-col w-full text-purple-500 text-xxl gap-2 max-w-96 mb-2">
        Transações Recentes
      </div>
      <FloatingBox containerClassName="w-96">
        <div className="flex justify-between">
          <HistorySelectButton
            label="Todos"
            isSelected={selectedTab === undefined}
            onClick={() => {
              setSelectedTab(undefined);
            }}
          />
          <HistorySelectButton
            label="Vendas"
            isSelected={selectedTab === "Vendas"}
            onClick={() => {
              setSelectedTab("Vendas");
            }}
          />
          <HistorySelectButton
            label="Gastos"
            isSelected={selectedTab === "Gastos"}
            onClick={() => {
              setSelectedTab("Gastos");
            }}
          />
        </div>
        {data}
        <GhostButton
          onClick={() => {
            setVerMais(!verMais);
          
          }}
          label={!verMais ? "Ver mais" : "Ver menos"}
        />
      </FloatingBox>
    </div>
  );
};
export default DashHistory;
