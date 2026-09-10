# Trilha de Nascimento

Projeto da disciplina de Programação Web. A ideia é simples: você informa sua data de nascimento e a aplicação mostra álbuns famosos lançados naquele mesmo mês (em qualquer ano). Também dá pra criar uma conta, cadastrar seus próprios álbuns e favoritar os que aparecem na busca.

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
npx prisma migrate dev
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`.

O comando `npm run seed` busca álbuns famosos na API pública do MusicBrainz (data real de lançamento, gênero e capa) e popula o banco local. Ele respeita o limite de 1 requisição por segundo do MusicBrainz, então demora alguns minutos.

O `.env` precisa de uma `JWT_SECRET` (qualquer string aleatória longa) além da `DATABASE_URL` e `PORT` — o `.env.example` já traz um exemplo.

### Frontend

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` e espera a API rodando em `http://localhost:3333` (ajustável em `.env`).

## Funcionalidades

- Buscar álbuns lançados no seu mês de nascimento
- Criar conta e fazer login
- Cadastrar um álbum novo (precisa estar logado)
- Favoritar álbuns e ver sua lista de favoritos

## API

**Álbuns**
- `GET /api/albums` — lista álbuns cadastrados. Aceita `?month=` (1-12) e `?year=` como filtros. Se autenticado, cada álbum vem com `favorited` indicando se o usuário logado já favoritou.
- `GET /api/albums/:id` — retorna um álbum específico.
- `POST /api/albums` — cadastra um álbum novo (**exige login**, token no header `Authorization: Bearer <token>`).

Campos do álbum: `title`, `artist`, `releaseYear`, `releaseMonth`, `genre`, `coverUrl` (opcional), `description` (opcional).

**Usuários**
- `POST /api/auth/signup` — cria uma conta. Campos: `name`, `email`, `password`, `birthdate`, `favoriteGenre`. Retorna o usuário e um token JWT.
- `POST /api/auth/login` — autentica com `email` e `password`, retorna o usuário e um token.

**Favoritos** (exigem login)
- `GET /api/favorites` — lista os álbuns favoritados pelo usuário logado.
- `POST /api/favorites/toggle` — favorita ou desfavorita um álbum (`{ "albumId": 1 }`).
