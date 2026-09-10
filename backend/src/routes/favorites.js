// Rotas de favoritos. Todas exigem login (requireAuth).
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { toggleFavorite, listFavorites } from "../controllers/favoriteController.js";

const router = Router();

router.get("/", requireAuth, listFavorites); // GET /api/favorites (lista os favoritos do usuario)
router.post("/toggle", requireAuth, toggleFavorite); // POST /api/favorites/toggle (favorita/desfavorita)

export default router;
