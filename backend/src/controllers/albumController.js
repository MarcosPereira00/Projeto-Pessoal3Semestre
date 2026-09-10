// Handlers do recurso Album: recebem req/res, falam com o banco via Prisma e devolvem JSON.
import { prisma } from "../prismaClient.js";

const REQUIRED_FIELDS = ["title", "artist", "releaseYear", "releaseMonth", "genre"];
const AUTHOR_SELECT = { author: { select: { id: true, name: true } } };

// Marca cada album com favorited: true/false para o usuario logado.
// Se nao houver usuario (visitante), devolve a lista sem mexer.
async function annotateFavorites(albums, userId) {
  if (!userId) return albums;

  const favorites = await prisma.favorite.findMany({
    where: { userId, albumId: { in: albums.map((album) => album.id) } },
    select: { albumId: true },
  });

  const favoritedIds = new Set(favorites.map((favorite) => favorite.albumId));
  return albums.map((album) => ({ ...album, favorited: favoritedIds.has(album.id) }));
}

// GET /api/albums - lista os albuns, filtrando por mes/ano se vier na query string
export async function listAlbums(req, res) {
  const { month, year } = req.query;

  const where = {};
  if (month) where.releaseMonth = Number(month);
  if (year) where.releaseYear = Number(year);

  const albums = await prisma.album.findMany({
    where,
    include: AUTHOR_SELECT,
    orderBy: [{ releaseYear: "asc" }, { releaseMonth: "asc" }],
  });

  res.json(await annotateFavorites(albums, req.user?.id));
}

export async function getAlbum(req, res) {
  const album = await prisma.album.findUnique({
    where: { id: Number(req.params.id) },
    include: AUTHOR_SELECT,
  });

  if (!album) {
    return res.status(404).json({ error: "Album nao encontrado" });
  }

  const [annotated] = await annotateFavorites([album], req.user?.id);
  res.json(annotated);
}

// POST /api/albums - cria um album novo. So chega aqui quem passou pelo requireAuth,
// entao req.user.id sempre existe e vira o autor do album.
export async function createAlbum(req, res) {
  const data = req.body;

  // valida os campos obrigatorios antes de tentar gravar
  const missing = REQUIRED_FIELDS.filter((field) => !data[field] && data[field] !== 0);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Campos obrigatorios faltando: ${missing.join(", ")}` });
  }

  if (data.releaseMonth < 1 || data.releaseMonth > 12) {
    return res.status(400).json({ error: "releaseMonth deve estar entre 1 e 12" });
  }

  const album = await prisma.album.create({
    data: {
      title: data.title,
      artist: data.artist,
      releaseYear: Number(data.releaseYear),
      releaseMonth: Number(data.releaseMonth),
      genre: data.genre,
      coverUrl: data.coverUrl || null,
      description: data.description || null,
      authorId: req.user.id,
    },
    include: AUTHOR_SELECT,
  });

  res.status(201).json(album);
}
