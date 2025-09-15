import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/authMiddleware.js";
import crypto from 'crypto';

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

  // Rota para solicitar recuperação de senha
  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
      // Verificar se o email existe no banco de dados
      const [users] = await db.execute(
        "SELECT id, username, email FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({ 
          error: "E-mail não encontrado em nosso sistema." 
        });
      }

      const user = users[0];
      
      // Gerar token de recuperação (exemplo simples)
      // Use o crypto que já foi importado no topo - REMOVA a linha com require()
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hora

      // Salvar token no banco de dados
      await db.execute(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
        [resetToken, resetTokenExpiry, user.id]
      );

      // Aqui você implementaria o envio de email real
      // Por enquanto, vamos apenas logar o token
      console.log(`Token de recuperação para ${email}: ${resetToken}`);
      console.log(`Link: https://sevenscash.sevensreview.com.br/#/reset-password?token=${resetToken}`);

      res.json({ 
        message: "Instruções de recuperação enviadas para seu e-mail.",
        // Em produção, remova o token da resposta
        debug_token: resetToken // Apenas para desenvolvimento
      });
    } catch (err) {
      console.error("Erro ao processar recuperação de senha:", err);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  });

  // Rota para solicitar ajuda humana
  router.post("/password-support", async (req, res) => {
    const { username, message } = req.body;

    try {
      // Verificar se o usuário existe
      const [users] = await db.execute(
        "SELECT id, username, email FROM users WHERE username = ?",
        [username]
      );

      if (users.length === 0) {
        return res.status(404).json({ 
          error: "Usuário não encontrado em nosso sistema." 
        });
      }

      const user = users[0];
      
      // Aqui você implementaria o envio de email para o suporte
      console.log("=== SOLICITAÇÃO DE SUPORTE ===");
      console.log(`Usuário: ${username}`);
      console.log(`Email do usuário: ${user.email}`);
      console.log(`Mensagem: ${message || "Não informada"}`);
      console.log("==============================");

      res.json({ 
        message: "Sua solicitação foi enviada para nossa equipe de suporte. Entraremos em contato em breve."
      });
    } catch (err) {
      console.error("Erro ao processar solicitação de suporte:", err);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  });

  // Rota para redefinir a senha com token
  router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      // Verificar se o token é válido e não expirou
      const [users] = await db.execute(
        "SELECT id, reset_token_expiry FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
        [token, Date.now()]
      );

      if (users.length === 0) {
        return res.status(400).json({ 
          error: "Token inválido ou expirado." 
        });
      }

      const user = users[0];
      
      // Criptografar nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Atualizar senha e limpar token
      await db.execute(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
        [hashedPassword, user.id]
      );

      res.json({ 
        message: "Senha redefinida com sucesso!" 
      });
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  });

  return router;
}