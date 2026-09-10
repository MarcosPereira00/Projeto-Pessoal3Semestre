// Formulario de login (email + senha). O envio de fato acontece na ContaPage,
// que chama o login() do AuthContext.
import { useState } from "react";
import styles from "./LoginForm.module.css";

function LoginForm({ onSubmit, status, error }) {
  const [form, setForm] = useState({ email: "", password: "" });

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
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password">Senha</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {status === "error" && <p className={styles.error}>{error}</p>}

      <button className={styles.button} type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default LoginForm;
