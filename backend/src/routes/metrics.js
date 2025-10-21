// backend/src/routes/metrics.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

export default function createMetricsRoutes(db) {
  const router = express.Router();

  router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { year, month } = req.query;

      // Construção dinâmica do filtro de data
      let dateFilter = "";
      const params = [userId];

      if (year) {
        dateFilter += " AND YEAR(data) = ?";
        params.push(year);
      }
      if (month) {
        dateFilter += " AND MONTH(data) = ?";
        params.push(month);
      }

      // 1. KPIs Básicos (mantenha seu código atual)
      const [vendasRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS totalRevenue 
         FROM vendas 
         WHERE user_id = ?${dateFilter}`,
        params
      );
      const totalRevenue = parseFloat(vendasRows[0].totalRevenue);

      const [gastosRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS totalExpenses 
         FROM gastos 
         WHERE user_id = ? AND tipo_despesa != 'investimento'${dateFilter}`,
        params
      );
      const totalExpenses = parseFloat(gastosRows[0].totalExpenses);

      const [investRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS initialInvestment 
         FROM gastos 
         WHERE user_id = ? AND tipo_despesa = 'investimento'${dateFilter}`,
        params
      );
      const initialInvestment = parseFloat(investRows[0].initialInvestment);

      const netProfit = totalRevenue - totalExpenses;
      const cumulativeCashFlow = initialInvestment + netProfit;

      const paybackPeriod = netProfit > 0 && initialInvestment > 0
        ? initialInvestment / netProfit
        : 0;

      const tir = 0;

      // 🔥🔥🔥 NOVOS DADOS CRÍTICOS PARA O FRONTEND 🔥🔥🔥

      // 2. TRANSACTIONS (para a tabela do dashboard)
      const [transactionsRows] = await db.execute(
        `(SELECT id, data, descricao, valor as amount, 'Venda' as type 
          FROM vendas 
          WHERE user_id = ?${dateFilter})
         UNION ALL
         (SELECT id, data, descricao, valor as amount, 'Gasto' as type 
          FROM gastos 
          WHERE user_id = ?${dateFilter})
         ORDER BY data DESC 
         LIMIT 100`,
        [...params, ...params] // Duplica params para ambas as queries
      );

      const transactions = transactionsRows.map(row => ({
        id: row.id,
        data: row.data.toISOString().split('T')[0], // Formata como YYYY-MM-DD
        descricao: row.descricao,
        amount: parseFloat(row.amount),
        type: row.type
      }));

      // 3. SALES EXPENSES DATA (para gráfico de vendas vs despesas)
      const [salesExpensesRows] = await db.execute(
        `SELECT 
          DATE_FORMAT(data, '%Y-%m') as period,
          SUM(CASE WHEN source = 'vendas' THEN amount ELSE 0 END) as sales,
          SUM(CASE WHEN source = 'gastos' THEN amount ELSE 0 END) as expenses
        FROM (
          SELECT data, valor as amount, 'vendas' as source FROM vendas WHERE user_id = ?${dateFilter}
          UNION ALL
          SELECT data, valor as amount, 'gastos' as source FROM gastos WHERE user_id = ? AND tipo_despesa != 'investimento'${dateFilter}
        ) AS combined
        GROUP BY DATE_FORMAT(data, '%Y-%m')
        ORDER BY period`,
        [...params, ...params]
      );

      const salesExpensesData = salesExpensesRows.map(row => ({
        period: row.period,
        sales: parseFloat(row.sales),
        expenses: parseFloat(row.expenses)
      }));

      // 4. CUMULATIVE CASH FLOW DATA (para gráfico de fluxo acumulado)
      let cumulative = initialInvestment;
      const cumulativeCashFlowData = salesExpensesRows.map(row => {
        cumulative += (parseFloat(row.sales) - parseFloat(row.expenses));
        return {
          period: row.period,
          cumulativeCashFlow: cumulative
        };
      });

      // 5. CHART DATA (para os KPIs - formato alternativo)
      const chartData = [
        { name: "Receita", value: totalRevenue, period: "total" },
        { name: "Despesas", value: totalExpenses, period: "total" },
        { name: "Lucro Líquido", value: netProfit, period: "total" },
        { name: "Investimento", value: initialInvestment, period: "total" },
      ];

      // ✅ RESPOSTA COMPLETA PARA O FRONTEND
      res.json({
        // KPIs (seus dados atuais)
        totalRevenue,
        totalExpenses,
        netProfit,
        cumulativeCashFlow,
        initialInvestment,
        paybackPeriod,
        tir,
        
        // 🔥 DADOS NOVOS (necessários para o frontend)
        transactions,
        salesExpensesData,
        cumulativeCashFlowData,
        chartData
      });

    } catch (err) {
      console.error("Erro ao calcular métricas:", err);
      res.status(500).json({
        error: "Erro ao calcular métricas",
        details: err.message,
      });
    }
  });

  return router;
}