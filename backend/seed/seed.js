// Script que popula o banco uma vez (rodar com `npm run seed`).
// Para cada album da lista em albums.js, busca no MusicBrainz o artista,
// acha o album na discografia dele e grava data de lancamento, genero e capa.
// Assim a tela de consulta sempre tem dados reais vindos da API, nada chumbado.
import "dotenv/config";
import { prisma } from "../src/prismaClient.js";
import { curatedAlbums } from "./albums.js";

const USER_AGENT = "AlbunsDoNascimento/1.0 ( github.com/MarcosPereira00 )";
const MB_BASE = "https://musicbrainz.org/ws/2";
const REQUEST_GAP_MS = 1100;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastRequestAt = 0;

async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < REQUEST_GAP_MS) await wait(REQUEST_GAP_MS - elapsed);
  lastRequestAt = Date.now();
}

async function fetchWithRetry(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await throttle();
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) return res;
    if (res.status !== 503 || attempt === attempts) return res;
    await wait(3000 * attempt);
  }
}

function normalizeTitle(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 1)
    .join(" ");
}

const artistIdCache = new Map();

async function findArtistId(name) {
  if (artistIdCache.has(name)) return artistIdCache.get(name);

  const url = `${MB_BASE}/artist/?query=${encodeURIComponent(`artist:"${name}"`)}&fmt=json&limit=1`;
  const res = await fetchWithRetry(url);
  const id = res.ok ? (await res.json()).artists?.[0]?.id || null : null;

  artistIdCache.set(name, id);
  return id;
}

async function findAlbumInDiscography(artistId, title) {
  const url = `${MB_BASE}/release-group?artist=${artistId}&limit=100&fmt=json`;
  const res = await fetchWithRetry(url);
  if (!res.ok) return null;

  const data = await res.json();
  const groups = data["release-groups"] || [];
  const target = normalizeTitle(title);

  const matches = groups.filter((g) => normalizeTitle(g.title) === target);
  if (matches.length === 0) return null;

  const albumTyped = matches.filter((g) => g["primary-type"] === "Album");
  const pool = albumTyped.length > 0 ? albumTyped : matches;

  const withDate = pool.filter((g) => g["first-release-date"]);
  if (withDate.length === 0) return pool[0];

  return withDate.sort((a, b) => a["first-release-date"].localeCompare(b["first-release-date"]))[0];
}

async function findReleaseGroup(title, artist) {
  const artistId = await findArtistId(artist);
  if (!artistId) return null;

  return findAlbumInDiscography(artistId, title);
}

async function fetchTags(mbid) {
  const url = `${MB_BASE}/release-group/${mbid}?inc=tags&fmt=json`;
  const res = await fetchWithRetry(url);
  if (!res.ok) return [];

  const data = await res.json();
  return data.tags || [];
}

function parseReleaseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  const year = Number(parts[0]);
  const month = parts[1] ? Number(parts[1]) : 1;
  if (!year) return null;
  return { year, month };
}

function pickGenre(tags) {
  if (!tags || tags.length === 0) return "Diversos";
  const sorted = [...tags].sort((a, b) => b.count - a.count);
  return sorted[0].name;
}

async function run() {
  console.log(`Populando banco com ${curatedAlbums.length} albuns via MusicBrainz...`);

  let created = 0;
  let skipped = 0;

  for (const entry of curatedAlbums) {
    const exists = await prisma.album.findFirst({
      where: { title: entry.title, artist: entry.artist },
    });

    if (exists) {
      skipped++;
      continue;
    }

    const releaseGroup = await findReleaseGroup(entry.title, entry.artist);

    if (!releaseGroup) {
      console.log(`  nao encontrado: ${entry.title} - ${entry.artist}`);
      continue;
    }

    const date = parseReleaseDate(releaseGroup["first-release-date"]);
    if (!date) {
      console.log(`  sem data de lancamento: ${entry.title} - ${entry.artist}`);
      continue;
    }

    const tags = await fetchTags(releaseGroup.id);

    await prisma.album.create({
      data: {
        title: entry.title,
        artist: entry.artist,
        releaseYear: date.year,
        releaseMonth: date.month,
        genre: pickGenre(tags),
        coverUrl: `https://coverartarchive.org/release-group/${releaseGroup.id}/front-250`,
        description: `${entry.title}, de ${entry.artist}, lancado em ${date.month}/${date.year}.`,
      },
    });

    created++;
    console.log(`  ok: ${entry.title} - ${entry.artist} (${date.month}/${date.year})`);
  }

  console.log(`Concluido. Criados: ${created}, ja existentes: ${skipped}.`);
  await prisma.$disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
