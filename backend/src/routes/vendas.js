import express from "express";
import Joi from "joi";
import { authenticateToken } from "../middleware/authMiddleware.js";

export default function createVendasRoutes(db) {
  const router = express.Router();

  // Esquema de validação com Joi
  const vendaSchema = Joi.object({
    descricao: Joi.string().min(1).required(),
    valor: Joi.number().positive().required(),
    categoria: Joi.string().valid("produto", "servico", "salario").required(),
    data: Joi.date().iso().optional(),
    nome: Joi.string().optional()
  });

  // Listar todas as vendas do usuário logado
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM vendas WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
      res.status(500).json({ error: "Erro ao buscar vendas", details: err.message });
    }
  });

  // Criar nova venda
  router.post("/", authenticateToken, async (req, res) => {
    console.log("Dados recebidos no POST /vendas:", req.body);

    const { error, value } = vendaSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { descricao, valor, categoria, data, nome } = value;

    try {
      const [result] = await db.execute(
        "INSERT INTO vendas (user_id, descricao, valor, categoria, data, nome) VALUES (?, ?, ?, ?, ?, ?)",
        [
          req.user.id,
          descricao,
          valor,
          categoria,
          data || new Date(),
          nome || descricao
        ]
      );

      res.status(201).json({
        id: result.insertId,
        user_id: req.user.id,
        descricao,
        valor,
        categoria,
        data: data || new Date(),
        nome: nome || descricao
      });
    } catch (err) {
      console.error("Erro ao criar venda:", err);
      res.status(500).json({ error: "Erro ao criar venda", details: err.message });
    }
  });

  // Atualizar venda
  router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { error, value } = vendaSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { descricao, valor, categoria, data, nome } = value;

    try {
      await db.execute(
        "UPDATE vendas SET descricao = ?, valor = ?, categoria = ?, data = ?, nome = ? WHERE id = ? AND user_id = ?",
        [
          descricao,
          valor,
          categoria,
          data || new Date(),
          nome || descricao,
          id,
          req.user.id
        ]
      );
      res.json({
        id,
        descricao,
        valor,
        categoria,
        data: data || new Date(),
        nome: nome || descricao
      });
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      res.status(500).json({ error: "Erro ao atualizar venda", details: err.message });
    }
  });

  // Deletar venda
  router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute("DELETE FROM vendas WHERE id = ? AND user_id = ?", [id, req.user.id]);
      res.json({ message: "Venda deletada" });
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
      res.status(500).json({ error: "Erro ao deletar venda", details: err.message });
    }
  });

  return router;
}