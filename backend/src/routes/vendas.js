// src/routes/vendas.js
const { Router } = require("express");
const router = Router();

// Array temporário de vendas
let vendas = [];

// GET /vendas - listar todas as vendas
router.get("/", (req, res) => {
  res.json({ vendas });
});

// POST /vendas - adicionar uma venda
router.post("/", (req, res) => {
  const venda = { ...req.body, id: Date.now().toString() }; // id gerado como string
  vendas.push(venda);
  res.json({ venda });
});

// PUT /vendas/:id - atualizar uma venda
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const index = vendas.findIndex(v => v.id === id);
  if (index !== -1) {
    vendas[index] = { ...vendas[index], ...req.body };
    res.json({ venda: vendas[index] });
  } else {
    res.status(404).json({ message: "Venda não encontrada" });
  }
});

// DELETE /vendas/:id - remover uma venda
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  vendas = vendas.filter(v => v.id !== id);
  res.status(204).send();
});

module.exports = router;
