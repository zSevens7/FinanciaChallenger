// backend/src/routes/vendas.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import mysql from "mysql2/promise";

const router = express.Router();

// Conexão com MySQL usando .env
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Listar todas as vendas do usuário logado
router.get("/", authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM vendas WHERE user_id = ?",
      [req.user.id]
    );
    await connection.end();
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
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO vendas (user_id, descricao, valor, categoria, data) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, descricao, valor, categoria, data]
    );
    await connection.end();

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
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE vendas SET descricao = ?, valor = ?, categoria = ?, data = ? WHERE id = ? AND user_id = ?",
      [descricao, valor, categoria, data, id, req.user.id]
    );
    await connection.end();

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
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "DELETE FROM vendas WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    res.json({ message: "Venda deletada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar venda" });
  }
});

export default router;
