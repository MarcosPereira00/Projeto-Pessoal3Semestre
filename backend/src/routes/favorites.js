import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { toggleFavorite, listFavorites } from "../controllers/favoriteController.js";

const router = Router();

router.get("/", requireAuth, listFavorites);
router.post("/toggle", requireAuth, toggleFavorite);

export default router;
