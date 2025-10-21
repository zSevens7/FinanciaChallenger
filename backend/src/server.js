// backend/src/server.js - VERSÃO CORRIGIDA
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
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// ==== ROTAS BÁSICAS ====
app.get("/", (req, res) => res.send("API is running"));
app.get("/health", (req, res) => res.json({
  status: "OK",
  message: "Servidor rodando corretamente",
  timestamp: new Date().toISOString()
}));

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
    res.status(500).json({ error: "Falha na conexão com o banco", details: err.message });
  }
});

// ==== ROTA SIMPLES PARA METRICS (TEMPORÁRIA) ====
app.get("/api/metrics", (req, res) => {
  console.log("📊 Rota /api/metrics acessada");
  res.json({
    totalRevenue: 50000,
    totalExpenses: 30000,
    netProfit: 20000,
    cumulativeCashFlow: 20000,
    initialInvestment: 100000,
    paybackPeriod: 5,
    tir: 0.15,
    transactions: [],
    salesExpensesData: [],
    cumulativeCashFlowData: [],
    chartData: []
  });
});

// ==== INICIALIZAÇÃO DO SERVIDOR ====
async function initializeServer() {
  try {
    console.log('🔄 Inicializando servidor...');

    // ==== POOL DE CONEXÃO COM MYSQL ====
    const db = await mysql.createPool({
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

    // ==== IMPORTAR ROTAS SEGURAS ====
    const safeModules = ["auth", "vendas", "gastos"]; // ← metrics removida temporariamente
    for (const mod of safeModules) {
      try {
        const routeModule = await import(`./routes/${mod}.js`);
        const createRoute = routeModule.default;
        app.use(`/api/${mod}`, createRoute(db));
        console.log(`✅ Rota /api/${mod} importada com sucesso`);
      } catch (err) {
        console.error(`❌ Erro ao importar rota /api/${mod}:`, err.message);
      }
    }

    // ==== INICIAR SERVIDOR ====
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Banco: ${process.env.DB_HOST || 'N/A'}/${process.env.DB_NAME || 'N/A'}`);
      console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? "OK" : "NÃO CARREGADO"}`);
    });

    // ==== GRACEFUL SHUTDOWN ====
    process.on('SIGINT', () => {
      console.log('\n🛑 Desligando servidor...');
      server.close(() => {
        console.log('✅ Servidor fechado');
        db.end();
        console.log('✅ Conexão com o banco fechada');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Falha crítica ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Inicializar servidor
initializeServer().catch(error => {
  console.error('❌ Erro na inicialização:', error);
});