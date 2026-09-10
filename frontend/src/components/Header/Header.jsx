// Cabecalho com o menu. Cada botao chama onChangeView para trocar a pagina.
// "Favoritos" so aparece logado; o ultimo botao vira "Ola, Nome" apos o login.
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Header.module.css";

function Header({ view, onChangeView }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.disc} />
        <h1 className={styles.title}>Trilha de Nascimento</h1>
      </div>

      <nav className={styles.nav}>
        <button
          className={view === "descobrir" ? styles.navButtonActive : styles.navButton}
          onClick={() => onChangeView("descobrir")}
        >
          Descobrir
        </button>
        <button
          className={view === "cadastrar" ? styles.navButtonActive : styles.navButton}
          onClick={() => onChangeView("cadastrar")}
        >
          Cadastrar album
        </button>
        {isAuthenticated && (
          <button
            className={view === "favoritos" ? styles.navButtonActive : styles.navButton}
            onClick={() => onChangeView("favoritos")}
          >
            Favoritos
          </button>
        )}
        <button
          className={view === "conta" ? styles.navButtonActive : styles.navButton}
          onClick={() => onChangeView("conta")}
        >
          {isAuthenticated ? `Ola, ${user.name.split(" ")[0]}` : "Entrar"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
