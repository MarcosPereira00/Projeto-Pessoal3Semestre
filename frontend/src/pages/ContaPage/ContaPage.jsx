import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import SignupForm from "../../components/SignupForm/SignupForm.jsx";
import styles from "./ContaPage.module.css";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function ContaPage() {
  const { user, isAuthenticated, login, signup, logout } = useAuth();
  const [tab, setTab] = useState("entrar");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleLogin(data) {
    setStatus("loading");
    try {
      await login(data);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  async function handleSignup(data) {
    setStatus("loading");
    try {
      await signup(data);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (isAuthenticated) {
    return (
      <section className={styles.page}>
        <div className={styles.profile}>
          <h2>Ola, {user.name}</h2>
          <dl className={styles.details}>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Data de nascimento</dt>
            <dd>{formatDate(user.birthdate)}</dd>
            <dt>Genero favorito</dt>
            <dd>{user.favoriteGenre}</dd>
          </dl>
          <button className={styles.logoutButton} onClick={logout} type="button">
            Sair
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <nav className={styles.tabs}>
        <button
          className={tab === "entrar" ? styles.tabActive : styles.tab}
          onClick={() => setTab("entrar")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={tab === "criar" ? styles.tabActive : styles.tab}
          onClick={() => setTab("criar")}
          type="button"
        >
          Criar conta
        </button>
      </nav>

      {tab === "entrar" ? (
        <LoginForm onSubmit={handleLogin} status={status} error={error} />
      ) : (
        <SignupForm onSubmit={handleSignup} status={status} error={error} />
      )}
    </section>
  );
}

export default ContaPage;
