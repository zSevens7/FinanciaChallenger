import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Export a function that accepts the DB pool
export default function createAuthRoutes(db) {
  const router = express.Router();

  // Register
  router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos." });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );
      console.log("Novo usuário registrado:", email);
      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        userId: result.insertId,
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res
          .status(409)
          .json({ error: "Usuário ou email já existem." });
      console.error("Erro ao inserir usuário:", err);
      res.status(500).json({ error: "Erro no servidor." });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Preencha todos os campos." });

    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
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

  // Profile
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const { id } = req.user;
      const [rows] = await db.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
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

  // Health check
  router.get("/check", (_req, res) =>
    res.json({
      status: "OK",
      message: "Auth API is working",
      timestamp: new Date().toISOString(),
    })
  );

  return router;
}