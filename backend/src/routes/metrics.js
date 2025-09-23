// backend/src/routes/metrics.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

export default function createMetricsRoutes(db) {
  const router = express.Router();

  router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;

      // Total de Vendas
      const [vendasRows] = await db.execute(
        "SELECT SUM(valor) as totalRevenue FROM vendas WHERE user_id = ?",
        [userId]
      );
      const totalRevenue = parseFloat(vendasRows[0].totalRevenue) || 0;

      // Total de Despesas
      const [gastosRows] = await db.execute(
        "SELECT SUM(valor) as totalExpenses FROM gastos WHERE user_id = ? AND tipo_despesa != 'investimento'",
        [userId]
      );
      const totalExpenses = parseFloat(gastosRows[0].totalExpenses) || 0;

      // Investimento Inicial
      const [investRows] = await db.execute(
        "SELECT SUM(valor) as initialInvestment FROM gastos WHERE user_id = ? AND tipo_despesa = 'investimento'",
        [userId]
      );
      const initialInvestment = parseFloat(investRows[0].initialInvestment) || 0;

      const netProfit = totalRevenue - totalExpenses;
      const cumulativeCashFlow = initialInvestment + netProfit;

      // Payback
      const paybackPeriod = netProfit > 0 ? initialInvestment / netProfit : 0;

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
      res.status(500).json({ error: "Erro ao calcular métricas", details: err.message });
    }
  });

  return router;
}
