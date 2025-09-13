import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // <--- importar o path

dotenv.config({ path: path.resolve('../.env') }); // ajusta conforme a estrutura do projeto
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

import authRoutes from "./routes/auth.js";
import gastosRoutes from "./routes/gastos.js";
import vendasRoutes from "./routes/vendas.js"; 
import { authenticateToken } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Remove o prefixo "/api" das rotas aqui
app.use("/auth", authRoutes);
app.use("/gastos", authenticateToken, gastosRoutes);
app.use("/vendas", authenticateToken, vendasRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API FinanciaChallenger rodando 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
