// Middlewares de autenticacao. O front manda o token JWT no header
// "Authorization: Bearer <token>"; aqui a gente valida esse token e,
// se estiver ok, coloca os dados do usuario em req.user.
import jwt from "jsonwebtoken";

// Bloqueia a rota se nao houver token valido. Usado no POST de album e nos favoritos.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Necessario estar logado" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Sessao invalida ou expirada" });
  }
}

// Nao bloqueia nada: se vier token valido preenche req.user, se nao vier segue normal.
// Usado no GET de albuns para saber quais o usuario ja favoritou (quando esta logado).
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }

  next();
}
