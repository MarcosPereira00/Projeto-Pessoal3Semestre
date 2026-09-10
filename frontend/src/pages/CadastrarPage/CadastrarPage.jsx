import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AlbumForm from "../../components/AlbumForm/AlbumForm.jsx";
import { createAlbum } from "../../services/api.js";
import styles from "./CadastrarPage.module.css";

function CadastrarPage({ onNavigateToConta }) {
  const { token, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleCreate(album) {
    setStatus("loading");

    try {
      await createAlbum(album, token);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (!isAuthenticated) {
    return (
      <section className={styles.page}>
        <div className={styles.intro}>
          <h2>Cadastrar um album</h2>
          <p>Voce precisa estar logado para cadastrar um album.</p>
        </div>
        <button className={styles.loginPrompt} onClick={onNavigateToConta} type="button">
          Entrar ou criar conta
        </button>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.intro}>
        <h2>Cadastrar um album</h2>
        <p>Adicione um album ao acervo para que ele apareca na busca por mes de nascimento.</p>
      </div>

      <AlbumForm onCreate={handleCreate} status={status} error={error} />
    </section>
  );
}

export default CadastrarPage;
