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
<<<<<<< HEAD
   // Criar uma nova venda
router.post("/", authenticateToken, async (req, res) => {
  console.log("Dados recebidos no POST /vendas:", req.body);

  // Aceitar tanto 'valor' quanto 'preco' como campo para o valor
  const { descricao, valor, preco, categoria, data, tipo, nome, tipoVenda } = req.body;

  // Usar 'preco' se 'valor' não estiver presente
  const valorFinal = valor !== undefined ? valor : preco;

  if (!descricao || valorFinal === undefined || !data) {
    return res.status(400).json({ 
      error: "Preencha todos os campos obrigatórios (descricao, valor/preco, data)",
      received: req.body
    });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO vendas (user_id, descricao, valor, categoria, data, tipo, nome, tipo_venda) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.id, 
        descricao, 
        valorFinal, 
        categoria || 'Outros', // Categoria opcional, padrão 'Outros'
        data,
        tipo || null,
        nome || null,
        tipoVenda || null
      ]
    );

    res.status(201).json({
      venda: {
        id: result.insertId,
        user_id: req.user.id,
        descricao,
        valor: valorFinal,
        preco: valorFinal, // Adicionando a propriedade 'preco' para o frontend
        categoria: categoria || 'Outros',
        data,
        tipo: tipo || null,
        nome: nome || null,
        tipo_venda: tipoVenda || null
      },
    });
  } catch (err) {
    console.error("Erro ao criar venda:", err);
    res.status(500).json({ error: "Erro ao criar venda", details: err.message });
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
=======
  router.post("/", authenticateToken, async (req, res) => {
    const { descricao, valor, categoria, data } = req.body;
    if (!descricao || !valor || !categoria || !data) {
      return res.status(400).json({ error: "Preencha todos os campos." });
>>>>>>> d1cf8032cb3a23589086c5da902b7db9929e272f
    }
  });

<<<<<<< HEAD
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
=======
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
>>>>>>> d1cf8032cb3a23589086c5da902b7db9929e272f
