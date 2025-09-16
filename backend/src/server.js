import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import createAuthRoutes from "./routes/auth.js";
import createGastosRoutes from "./routes/gastos.js";
import createVendasRoutes from "./routes/vendas.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());

// 1. Initialize the DB pool here
const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

// 2. Test the connection once at startup
;(async () => {
  try {
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    console.log("✅ MySQL connection OK:", rows[0].result);
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
    process.exit(1);
  }
})();

// 3. Mount the auth routes, passing `db`
app.use("/auth", createAuthRoutes(db));

// 4. Mount the gastos routes, passing `db`
app.use("/gastos", createGastosRoutes(db));

// 5. Mount the vendas routes, passing `db`
app.use("/vendas", createVendasRoutes(db));

// 6. Your other middleware/routes here...
app.get("/", (req, res) => res.send("🚀 API is running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
