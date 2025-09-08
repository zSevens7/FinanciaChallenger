import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API FinanciaChallenger rodando 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));