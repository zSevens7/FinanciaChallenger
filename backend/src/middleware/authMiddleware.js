import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acesso necessário" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    req.user = decoded;
    next();
  });
}

export default authenticateToken;
