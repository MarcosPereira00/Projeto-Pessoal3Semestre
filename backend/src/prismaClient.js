// Instancia unica do Prisma (o ORM que fala com o banco SQLite).
// Todos os controllers importam este mesmo `prisma` para fazer as queries.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
