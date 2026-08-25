# Trilha de Nascimento

Projeto da disciplina de Programação Web. A ideia é simples: você informa sua data de nascimento e a aplicação mostra álbuns famosos lançados naquele mesmo mês (em qualquer ano).

Tema: música.

## Estrutura

- `backend/` — API REST em Node.js + Express, banco SQLite via Prisma.
- `frontend/` — aplicação React (Vite) que consome a API, estilizada com CSS Modules.

## Como rodar

### Backend

```
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`.

O comando `npm run seed` busca álbuns famosos na API pública do MusicBrainz (data real de lançamento, gênero e capa) e popula o banco local. Ele respeita o limite de 1 requisição por segundo do MusicBrainz, então demora alguns minutos.

### Frontend

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` e espera a API rodando em `http://localhost:3333` (ajustável em `.env`).

## API

- `GET /api/albums` — lista álbuns cadastrados. Aceita `?month=` (1-12) e `?year=` como filtros.
- `GET /api/albums/:id` — retorna um álbum específico.
- `POST /api/albums` — cadastra um álbum novo.

Campos do álbum: `title`, `artist`, `releaseYear`, `releaseMonth`, `genre`, `coverUrl` (opcional), `description` (opcional).
