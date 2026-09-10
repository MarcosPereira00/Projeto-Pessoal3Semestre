// Handlers de favoritos. A tabela Favorite so guarda o par (userId, albumId).
import { prisma } from "../prismaClient.js";

// POST /api/favorites/toggle - se ja e favorito remove, se nao e adiciona
export async function toggleFavorite(req, res) {
  const albumId = Number(req.body.albumId);

  if (!albumId) {
    return res.status(400).json({ error: "albumId e obrigatorio" });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_albumId: { userId: req.user.id, albumId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return res.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: req.user.id, albumId },
  });

  res.json({ favorited: true });
}

// GET /api/favorites - devolve os albuns favoritados pelo usuario (ja no formato de album)
export async function listFavorites(req, res) {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user.id },
    include: { album: { include: { author: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(favorites.map((favorite) => ({ ...favorite.album, favorited: true })));
}
