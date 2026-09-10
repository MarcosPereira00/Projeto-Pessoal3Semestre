// Ponto de entrada da API. Cria o servidor Express, liga os middlewares
// globais e monta cada grupo de rotas em um prefixo de URL.
import express from "express";
import cors from "cors";
import "dotenv/config";
import albumsRouter from "./routes/albums.js";
import authRouter from "./routes/auth.js";
import favoritesRouter from "./routes/favorites.js";

const app = express();

app.use(cors()); // libera o front (outra porta) a chamar a API
app.use(express.json()); // le o corpo JSON das requisicoes e joga em req.body

// cada router cuida de um recurso; o prefixo aqui define a URL base dele
app.use("/api/albums", albumsRouter);
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// captura qualquer erro que estoure num handler e devolve 500 em vez de derrubar o servidor
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
