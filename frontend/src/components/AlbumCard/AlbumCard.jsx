// Card de um album: capa, titulo, artista, mes/ano, genero e quem cadastrou.
// A estrela (favoritar) so aparece quando o usuario esta logado.
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AlbumCard.module.css";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function AlbumCard({ album, onToggleFavorite }) {
  const { isAuthenticated } = useAuth();
  const [imgFailed, setImgFailed] = useState(false); // se a capa nao carregar, mostra o disco desenhado
  const [toggling, setToggling] = useState(false); // trava o botao enquanto a requisicao nao volta

  async function handleFavoriteClick() {
    if (!onToggleFavorite || toggling) return;
    setToggling(true);
    try {
      await onToggleFavorite(album.id);
    } finally {
      setToggling(false);
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.coverWrapper}>
        {album.coverUrl && !imgFailed ? (
          <img
            src={album.coverUrl}
            alt={`Capa do album ${album.title}`}
            className={styles.cover}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={styles.coverFallback}>
            <span className={styles.discMini} />
          </div>
        )}

        {isAuthenticated && onToggleFavorite && (
          <button
            type="button"
            className={album.favorited ? styles.favoriteButtonActive : styles.favoriteButton}
            onClick={handleFavoriteClick}
            disabled={toggling}
            aria-label={album.favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {album.favorited ? "★" : "☆"}
          </button>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{album.title}</h3>
        <p className={styles.artist}>{album.artist}</p>
        <div className={styles.meta}>
          <span className={styles.tag}>{MONTH_NAMES[album.releaseMonth - 1]} de {album.releaseYear}</span>
          <span className={styles.tag}>{album.genre}</span>
        </div>
        {album.description && <p className={styles.description}>{album.description}</p>}
        {album.author && <p className={styles.author}>Cadastrado por {album.author.name}</p>}
      </div>
    </article>
  );
}

export default AlbumCard;
