// backend/src/routes/metrics.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

export default function createMetricsRoutes(db) {
  const router = express.Router();

  router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { year, month } = req.query; // ← filtros opcionais vindos da URL

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

      // Total de Vendas
      const [vendasRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS totalRevenue 
         FROM vendas 
         WHERE user_id = ?${dateFilter}`,
        params
      );
      const totalRevenue = parseFloat(vendasRows[0].totalRevenue);

      // Total de Despesas (excluindo investimentos)
      const [gastosRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS totalExpenses 
         FROM gastos 
         WHERE user_id = ? AND tipo_despesa != 'investimento'${dateFilter}`,
        params
      );
      const totalExpenses = parseFloat(gastosRows[0].totalExpenses);

      // Investimento Inicial
      const [investRows] = await db.execute(
        `SELECT COALESCE(SUM(valor), 0) AS initialInvestment 
         FROM gastos 
         WHERE user_id = ? AND tipo_despesa = 'investimento'${dateFilter}`,
        params
      );
      const initialInvestment = parseFloat(investRows[0].initialInvestment);

      // Lucro líquido
      const netProfit = totalRevenue - totalExpenses;

      // Fluxo de caixa acumulado
      const cumulativeCashFlow = initialInvestment + netProfit;

      // Payback (seguro contra divisão por zero)
      const paybackPeriod =
        netProfit > 0 && initialInvestment > 0
          ? initialInvestment / netProfit
          : 0;

      // TIR (placeholder)
      const tir = 0;

      res.json({
        totalRevenue,
        totalExpenses,
        netProfit,
        cumulativeCashFlow,
        initialInvestment,
        paybackPeriod,
        tir,
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
