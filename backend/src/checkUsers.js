// checkUsers.js
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db");

db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error("Erro:", err.message);
  } else {
    console.log("Usuários cadastrados:", rows);
  }
  db.close();
});
