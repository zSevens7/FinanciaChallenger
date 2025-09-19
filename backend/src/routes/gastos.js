// routes/gastos.js - VERSÃO COM VALIDAÇÃO JOI

import express from "express";
import Joi from "joi";
import { authenticateToken } from "../middleware/authMiddleware.js";

export default function createGastosRoutes(db) {
  const router = express.Router();

  // Esquema de validação com Joi
  const gastoSchema = Joi.object({
    descricao: Joi.string().min(1).required(),
    valor: Joi.number().positive().required(),
    categoria: Joi.string().min(1).required(),
    data: Joi.date().iso().optional(),
    tipo: Joi.string().optional(),
    nome: Joi.string().optional(),
    tipoDespesa: Joi.string().optional(),
  });

  // Listar todos os gastos
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

  // Criar novo gasto
  router.post("/", authenticateToken, async (req, res) => {
    console.log("Dados recebidos no POST /gastos:", req.body);

    const { error, value } = gastoSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { descricao, valor, categoria, data, tipo, nome, tipoDespesa } = value;

    try {
      const [result] = await db.execute(
        "INSERT INTO gastos (user_id, descricao, valor, categoria, data, tipo, nome, tipo_despesa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.user.id,
          descricao,
          valor,
          categoria,
          data || new Date(),
          tipo || null,
          nome || descricao,
          tipoDespesa || null,
        ]
      );

      res.status(201).json({
        id: result.insertId,
        user_id: req.user.id,
        descricao,
        valor,
        categoria,
        data: data || new Date(),
        tipo,
        nome: nome || descricao,
        tipo_despesa: tipoDespesa || null,
      });
    } catch (err) {
      console.error("Erro ao criar gasto:", err);
      res.status(500).json({ error: "Erro ao criar gasto", details: err.message });
    }
  });

  // Atualizar gasto
  router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { error, value } = gastoSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { descricao, valor, categoria, data } = value;

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
      await db.execute("DELETE FROM gastos WHERE id = ? AND user_id = ?", [id, req.user.id]);
      res.json({ message: "Gasto deletado" });
    } catch (err) {
      console.error("Erro ao deletar gasto:", err);
      res.status(500).json({ error: "Erro ao deletar gasto", details: err.message });
    }
  });

  return router;
}
