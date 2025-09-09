// backend/src/routes/vendas.js
import { Router } from "express";
const router = Router();

let vendas = [];

router.get("/", (req, res) => {
  res.json({ vendas });
});

router.post("/", (req, res) => {
  const venda = { ...req.body, id: Date.now().toString() };
  vendas.push(venda);
  res.json({ venda });
});

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

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  vendas = vendas.filter(v => v.id !== id);
  res.status(204).send();
});

export default router;
