// Handlers de conta. Senha nunca e salva em texto puro: guarda so o hash (bcrypt).
// No login a gente devolve um token JWT que o front guarda e reenvia nas proximas chamadas.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";

const REQUIRED_FIELDS = ["name", "email", "password", "birthdate", "favoriteGenre"];

// devolve so os campos que podem ir pro front (sem o passwordHash)
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    birthdate: user.birthdate,
    favoriteGenre: user.favoriteGenre,
  };
}

// gera o token assinado com a JWT_SECRET do .env; expira em 7 dias
function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/signup - cria a conta e ja devolve o usuario + token (login automatico)
export async function signup(req, res) {
  const data = req.body;

  const missing = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Campos obrigatorios faltando: ${missing.join(", ")}` });
  }

  if (data.password.length < 6) {
    return res.status(400).json({ error: "A senha precisa ter pelo menos 6 caracteres" });
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return res.status(400).json({ error: "Ja existe uma conta com esse email" });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      birthdate: new Date(data.birthdate),
      favoriteGenre: data.favoriteGenre,
    },
  });

  res.status(201).json({ ...toPublicUser(user), token: signToken(user) });
}

// POST /api/auth/login - confere email + senha e devolve usuario + token
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Informe email e senha" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Email ou senha invalidos" });
  }

  // compara a senha digitada com o hash salvo
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Email ou senha invalidos" });
  }

  res.json({ ...toPublicUser(user), token: signToken(user) });
}
