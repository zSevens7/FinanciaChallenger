import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import gastosRoutes from "./routes/gastos.js";
import vendasRoutes from "./routes/vendas.js"; 
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gastos", authenticateToken, gastosRoutes);
app.use("/api/vendas", authenticateToken, vendasRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API FinanciaChallenger rodando 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
