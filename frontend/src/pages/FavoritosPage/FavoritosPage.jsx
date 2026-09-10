// Tela de favoritos. Busca a lista assim que abre (useEffect) e reaproveita
// a mesma AlbumList da tela de descoberta.
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import { getFavorites, toggleFavorite } from "../../services/api.js";
import styles from "./FavoritosPage.module.css";

function FavoritosPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState("loading");
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  // roda uma vez quando a tela abre (e de novo se o token mudar)
  useEffect(() => {
    getFavorites(token)
      .then((result) => {
        setAlbums(result);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [token]);

  // aqui desfavoritar tira o album da lista na hora (essa tela e so de favoritos)
  async function handleToggleFavorite(albumId) {
    const result = await toggleFavorite(albumId, token);
    if (!result.favorited) {
      setAlbums((prev) => prev.filter((album) => album.id !== albumId));
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.intro}>
        <h2>Seus albuns favoritos</h2>
      </div>

      <AlbumList
        status={status}
        albums={albums}
        error={error}
        emptyMessage="Voce ainda nao favoritou nenhum album."
        onToggleFavorite={handleToggleFavorite}
      />
    </section>
  );
}

export default FavoritosPage;
