import "dotenv/config";
import { prisma } from "../src/prismaClient.js";
import { curatedAlbums } from "./albums.js";

const USER_AGENT = "AlbunsDoNascimento/1.0 ( github.com/MarcosPereira00 )";
const MB_BASE = "https://musicbrainz.org/ws/2";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchReleaseGroup(title, artist) {
  const query = `releasegroup:"${title}" AND artist:"${artist}"`;
  const url = `${MB_BASE}/release-group/?query=${encodeURIComponent(query)}&fmt=json&limit=5`;

  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) return null;

  const data = await res.json();
  const groups = data["release-groups"] || [];
  if (groups.length === 0) return null;

  const album = groups.find((g) => g["primary-type"] === "Album") || groups[0];
  return album;
}

async function fetchTags(mbid) {
  const url = `${MB_BASE}/release-group/${mbid}?inc=tags&fmt=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
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

    const releaseGroup = await searchReleaseGroup(entry.title, entry.artist);
    await wait(1100);

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
    await wait(1100);

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
