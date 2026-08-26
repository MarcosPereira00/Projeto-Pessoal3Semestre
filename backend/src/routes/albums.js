import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { listAlbums, getAlbum, createAlbum } from "../controllers/albumController.js";

const router = Router();

router.get("/", optionalAuth, listAlbums);
router.get("/:id", optionalAuth, getAlbum);
router.post("/", requireAuth, createAlbum);

export default router;
