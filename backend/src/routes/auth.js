import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import fs from "fs";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const dbPath = "database.db";

// Conexão com SQLite
if (fs.existsSync(dbPath)) console.log("Banco existente detectado.");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("Erro ao conectar ao SQLite:", err.message);

  console.log("Conexão SQLite bem-sucedida.");

  const createTable = () => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      (createErr) => {
        if (createErr) console.error("Erro ao criar tabela 'users':", createErr.message);
        else console.log("Tabela 'users' verificada/criada com sucesso.");
      }
    );
  };

  createTable();
});

// Registro
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ error: "Preencha todos os campos." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
      [username, hashedPassword, email],
      function (err) {
        if (err) {
          if (err.message.includes("SQLITE_CONSTRAINT"))
            return res.status(409).json({ error: "Usuário ou email já existem." });
          return res.status(500).json({ error: "Erro no servidor." });
        }
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
      }
    );
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

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (!row)
      return res
        .status(400)
        .json({ error: "Usuário ou senha inválidos. Por favor, tente novamente." });

    const valid = await bcrypt.compare(password, row.password);
    if (!valid)
      return res
        .status(400)
        .json({ error: "Usuário ou senha inválidos. Por favor, tente novamente." });

    const token = jwt.sign(
      { id: row.id, username: row.username },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login bem-sucedido!", token });
  });
});

// Perfil do usuário logado
router.get("/profile", authenticateToken, (req, res) => {
  const { id } = req.user;
  db.get(
    `SELECT id, username, email, created_at FROM users WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro no servidor." });
      if (!row) return res.status(404).json({ error: "Usuário não encontrado." });
      res.json({ user: row });
    }
  );
});

export default router;
