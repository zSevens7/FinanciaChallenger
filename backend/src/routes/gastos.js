import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Export a function that accepts the DB pool
export default function createGastosRoutes(db) {
  const router = express.Router();

  // Listar todos os gastos do usuário logado
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM gastos WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar gastos:", err);
      res.status(500).json({ error: "Erro ao buscar gastos", details: err.message });
    }
  });

  // Criar um novo gasto
  router.post("/", authenticateToken, async (req, res) => {
    const { descricao, valor, categoria, data } = req.body;

    if (!descricao || !valor || !categoria)
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });

    try {
      const [result] = await db.execute(
        "INSERT INTO gastos (user_id, descricao, valor, categoria, data) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, descricao, valor, categoria, data || new Date()]
      );

      res.status(201).json({
        id: result.insertId,
        user_id: req.user.id,
        descricao,
        valor,
        categoria,
        data: data || new Date(),
      });
    } catch (err) {
      console.error("Erro ao criar gasto:", err);
      res.status(500).json({ error: "Erro ao criar gasto", details: err.message });
    }
  });

  // Atualizar gasto
  router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, categoria, data } = req.body;

    if (!descricao || !valor || !categoria)
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });

    try {
      await db.execute(
        "UPDATE gastos SET descricao = ?, valor = ?, categoria = ?, data = ? WHERE id = ? AND user_id = ?",
        [descricao, valor, categoria, data || new Date(), id, req.user.id]
      );
      res.json({ id, descricao, valor, categoria, data: data || new Date() });
    } catch (err) {
      console.error("Erro ao atualizar gasto:", err);
      res.status(500).json({ error: "Erro ao atualizar gasto", details: err.message });
    }
  });

  // Deletar gasto
  router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute(
        "DELETE FROM gastos WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );
      res.json({ message: "Gasto deletado" });
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
      res.status(500).json({ error: "Erro ao deletar gasto", details: err.message });
    }
  });

  return router;
}