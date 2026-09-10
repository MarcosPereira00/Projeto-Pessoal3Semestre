import AlbumCard from "../AlbumCard/AlbumCard.jsx";
import styles from "./AlbumList.module.css";

function AlbumList({
  status,
  albums,
  error,
  onToggleFavorite,
  idleMessage = "Informe sua data de nascimento para descobrir os albuns lancados no seu mes.",
  emptyMessage = "Nenhum album cadastrado para esse mes ainda. Que tal cadastrar um?",
}) {
  if (status === "idle") {
    return <p className={styles.message}>{idleMessage}</p>;
  }

  if (status === "loading") {
    return <p className={styles.message}>Buscando albuns...</p>;
  }

  if (status === "error") {
    return <p className={styles.messageError}>{error}</p>;
  }

  if (albums.length === 0) {
    return <p className={styles.message}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.grid}>
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}

export default AlbumList;
