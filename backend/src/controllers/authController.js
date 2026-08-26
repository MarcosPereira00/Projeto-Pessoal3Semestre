import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";

const REQUIRED_FIELDS = ["name", "email", "password", "birthdate", "favoriteGenre"];

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    birthdate: user.birthdate,
    favoriteGenre: user.favoriteGenre,
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

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

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Informe email e senha" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Email ou senha invalidos" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Email ou senha invalidos" });
  }

  res.json({ ...toPublicUser(user), token: signToken(user) });
}
