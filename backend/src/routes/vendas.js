import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Export a function that accepts the DB pool
export default function createVendasRoutes(db) {
  const router = express.Router();

  // Listar todas as vendas do usuário logado
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM vendas WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
      res.json({ vendas: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });

  // Criar uma nova venda
  router.post("/", authenticateToken, async (req, res) => {
    const { descricao, valor, categoria, data } = req.body;
    if (!descricao || !valor || !categoria || !data) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    try {
      const [result] = await db.execute(
        "INSERT INTO vendas (user_id, descricao, valor, categoria, data) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, descricao, valor, categoria, data]
      );

      res.status(201).json({
        venda: {
          id: result.insertId,
          user_id: req.user.id,
          descricao,
          valor,
          categoria,
          data,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar venda" });
    }
  });

  // Atualizar venda
  router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, categoria, data } = req.body;

    try {
      const [result] = await db.execute(
        "UPDATE vendas SET descricao = ?, valor = ?, categoria = ?, data = ? WHERE id = ? AND user_id = ?",
        [descricao, valor, categoria, data, id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Venda não encontrada" });
      }

      res.json({ venda: { id: Number(id), user_id: req.user.id, descricao, valor, categoria, data } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar venda" });
    }
  });

  // Deletar venda
  router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.execute(
        "DELETE FROM vendas WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Venda não encontrada" });
      }

      res.json({ message: "Venda deletada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar venda" });
    }
  });

  return router;
}