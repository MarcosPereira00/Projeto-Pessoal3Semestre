// Rotas do recurso Album. Cada linha liga um metodo HTTP + caminho
// a um middleware (opcional) e ao handler que responde.
import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { listAlbums, getAlbum, createAlbum } from "../controllers/albumController.js";

const router = Router();

router.get("/", optionalAuth, listAlbums); // GET /api/albums (lista, aceita ?month= e ?year=)
router.get("/:id", optionalAuth, getAlbum); // GET /api/albums/1 (um album)
router.post("/", requireAuth, createAlbum); // POST /api/albums (cadastrar, so logado)

export default router;
