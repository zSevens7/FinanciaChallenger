// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from 'url';

// Configurar caminhos para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==== CARREGAR ENV ====
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 4000;

// ==== MIDDLEWARES ====
app.use(cors({
  origin: [
    "https://sevenscash.sevensreview.com.br",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==== ROTAS BÁSICAS (definidas primeiro) ====
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor está rodando corretamente",
    timestamp: new Date().toISOString()
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    const [rows] = await connection.execute("SELECT NOW() as now");
    await connection.end();
    
    res.json({ status: "OK", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: "Falha na conexão com o banco" });
  }
});

app.get("/env", (req, res) => {
  res.json({
    dbHost: process.env.DB_HOST || "Não configurado",
    dbUser: process.env.DB_USER || "Não configurado",
    dbName: process.env.DB_NAME || "Não configurado",
    jwtSecret: process.env.JWT_SECRET ? "Configurado" : "Não configurado"
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.send("API is running");
});

// ==== INICIALIZAÇÃO DO SERVIDOR ====
async function initializeServer() {
  try {
    console.log('🔄 Inicializando servidor...');
    
    // ==== INICIALIZAR BANCO DE DADOS ====
    let db;
    try {
      db = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log('✅ Conectado ao banco de dados MySQL');
    } catch (dbError) {
      console.error('❌ Erro ao conectar com o banco de dados:', dbError.message);
      db = null;
    }

    // ==== IMPORTAR ROTAS ====
    let createAuthRoutes, createVendasRoutes, createGastosRoutes;
    
    try {
      const authModule = await import("./routes/auth.js");
      createAuthRoutes = authModule.default;
      console.log('✅ Rota auth importada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar auth:', error.message);
      createAuthRoutes = (db) => {
        const router = express.Router();
        router.get("/check", (req, res) => res.json({ message: "Auth API básica" }));
        return router;
      };
    }

    try {
      const vendasModule = await import("./routes/vendas.js");
      createVendasRoutes = vendasModule.default;
      console.log('✅ Rota vendas importada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar vendas:', error.message);
      createVendasRoutes = (db) => {
        const router = express.Router();
        router.get("/", (req, res) => res.json({ message: "Vendas API básica" }));
        return router;
      };
    }

    try {
      const gastosModule = await import("./routes/gastos.js");
      createGastosRoutes = gastosModule.default;
      console.log('✅ Rota gastos importada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar gastos:', error.message);
      createGastosRoutes = (db) => {
        const router = express.Router();
        router.get("/", (req, res) => res.json({ message: "Gastos API básica" }));
        return router;
      };
    }

    // ==== CONFIGURAR ROTAS PRINCIPAIS ====
    app.use("/auth", createAuthRoutes(db));
    app.use("/vendas", createVendasRoutes(db));
    app.use("/gastos", createGastosRoutes(db));

    // ==== INICIAR SERVIDOR ====
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? "OK" : "NÃO CARREGADO"}`);
      console.log(`🗄️ Banco: ${process.env.DB_HOST || 'N/A'}/${process.env.DB_NAME || 'N/A'}`);
    });

    // ==== GRACEFUL SHUTDOWN ====
    process.on('SIGINT', () => {
      console.log('\n🛑 Desligando servidor gracefulmente');
      server.close(() => {
        console.log('✅ Servidor fechado');
        if (db) {
          db.end();
          console.log('✅ Conexão com o banco fechada');
        }
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Falha crítica ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
initializeServer().catch(error => {
  console.error('❌ Erro na inicialização:', error);
});
