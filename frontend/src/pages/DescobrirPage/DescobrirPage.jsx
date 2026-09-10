// Tela principal (exibicao). Recebe a data de nascimento pelo BirthdateForm,
// pede a API os albuns daquele mes e mostra na AlbumList.
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import BirthdateForm from "../../components/BirthdateForm/BirthdateForm.jsx";
import AlbumList from "../../components/AlbumList/AlbumList.jsx";
import { getAlbumsByMonth, toggleFavorite } from "../../services/api.js";
import styles from "./DescobrirPage.module.css";

function DescobrirPage() {
  const { token } = useAuth();
  // status controla o que a AlbumList mostra: idle / loading / success / error
  const [status, setStatus] = useState("idle");
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);

  async function handleSearch(month) {
    setStatus("loading");
    setSelectedMonth(month);

    try {
      const result = await getAlbumsByMonth(month, token);
      setAlbums(result);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  // favorita/desfavorita e atualiza so aquele album na lista, sem refazer a busca
  async function handleToggleFavorite(albumId) {
    const result = await toggleFavorite(albumId, token);
    setAlbums((prev) =>
      prev.map((album) => (album.id === albumId ? { ...album, favorited: result.favorited } : album))
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.intro}>
        <h2>O que tocava quando voce nasceu?</h2>
        <p>Digite sua data de nascimento e descubra albuns lancados no mesmo mes, em qualquer ano.</p>
      </div>

      <BirthdateForm onSearch={handleSearch} />

      {selectedMonth && <p className={styles.resultLabel}>Resultados para o mes {selectedMonth}</p>}

      <AlbumList status={status} albums={albums} error={error} onToggleFavorite={handleToggleFavorite} />
    </section>
  );
}

export default DescobrirPage;
