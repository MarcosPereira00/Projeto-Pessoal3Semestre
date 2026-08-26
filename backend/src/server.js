import express from "express";
import cors from "cors";
import "dotenv/config";
import albumsRouter from "./routes/albums.js";
import authRouter from "./routes/auth.js";
import favoritesRouter from "./routes/favorites.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/albums", albumsRouter);
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
