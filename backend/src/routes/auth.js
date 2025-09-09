import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { authenticateToken } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Conexão MySQL remota
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Teste de conexão inicial
(async () => {
  try {
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    console.log("✅ Conexão com MySQL OK:", rows[0].result);
  } catch (err) {
    console.error("❌ Erro ao conectar no MySQL:", err);
  }
})();

// Registro de usuário
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ error: "Preencha todos os campos." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await db.execute(
        `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
        [username, hashedPassword, email]
      );
      console.log("Novo usuário registrado:", email);
      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        userId: result.insertId,
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "Usuário ou email já existem." });
      console.error("Erro ao inserir usuário:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
  } catch (error) {
    console.error("Erro ao criptografar senha:", error);
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

// Login pelo email
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });

  try {
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    const user = rows[0];

    if (!user)
      return res.status(400).json({ error: "Usuário ou senha inválidos." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: "Usuário ou senha inválidos." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    console.log("Usuário logado:", email);
    res.json({ message: "Login bem-sucedido!", token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Perfil do usuário logado
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const [rows] = await db.execute(
      `SELECT id, username, email, created_at FROM users WHERE id = ?`,
      [id]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json({ user });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

export default router;
