// Rotas de conta de usuario.
import { Router } from "express";
import { signup, login } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup); // POST /api/auth/signup (criar conta)
router.post("/login", login); // POST /api/auth/login (entrar, devolve o token)

export default router;
