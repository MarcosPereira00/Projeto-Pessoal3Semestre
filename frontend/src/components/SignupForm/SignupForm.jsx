import { useState } from "react";
import styles from "./SignupForm.module.css";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  birthdate: "",
  favoriteGenre: "",
};

function SignupForm({ onSubmit, status, error }) {
  const [form, setForm] = useState(INITIAL_STATE);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="signup-name">Nome</label>
        <input id="signup-name" name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-password">Senha</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-birthdate">Data de nascimento</label>
        <input
          id="signup-birthdate"
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-genre">Genero musical favorito</label>
        <input id="signup-genre" name="favoriteGenre" value={form.favoriteGenre} onChange={handleChange} required />
      </div>

      {status === "error" && <p className={styles.error}>{error}</p>}

      <button className={styles.button} type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}

export default SignupForm;
