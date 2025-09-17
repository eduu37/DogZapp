// auth.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autorizado" });
    if (req.user.rol !== role && req.user.rol !== "admin") {
      return res.status(403).json({ message: "Permiso denegado" });
    }
    next();
  };
}
