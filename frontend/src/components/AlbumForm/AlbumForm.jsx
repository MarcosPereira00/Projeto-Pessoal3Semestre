import { useState } from "react";
import styles from "./AlbumForm.module.css";

const INITIAL_STATE = {
  title: "",
  artist: "",
  releaseYear: "",
  releaseMonth: "",
  genre: "",
  coverUrl: "",
  description: "",
};

const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function AlbumForm({ onCreate, status, error }) {
  const [form, setForm] = useState(INITIAL_STATE);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onCreate({
      ...form,
      releaseYear: Number(form.releaseYear),
      releaseMonth: Number(form.releaseMonth),
    });
  }

  function handleSuccessReset() {
    setForm(INITIAL_STATE);
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <p>Album cadastrado com sucesso.</p>
        <button className={styles.button} onClick={handleSuccessReset} type="button">
          Cadastrar outro
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title">Titulo do album</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="artist">Artista</label>
        <input id="artist" name="artist" value={form.artist} onChange={handleChange} required />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="releaseMonth">Mes de lancamento</label>
          <select id="releaseMonth" name="releaseMonth" value={form.releaseMonth} onChange={handleChange} required>
            <option value="">Selecione</option>
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="releaseYear">Ano de lancamento</label>
          <input
            id="releaseYear"
            name="releaseYear"
            type="number"
            min="1900"
            max="2100"
            value={form.releaseYear}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="genre">Genero</label>
        <input id="genre" name="genre" value={form.genre} onChange={handleChange} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="coverUrl">URL da capa (opcional)</label>
        <input id="coverUrl" name="coverUrl" value={form.coverUrl} onChange={handleChange} />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Descricao (opcional)</label>
        <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} />
      </div>

      {status === "error" && <p className={styles.error}>{error}</p>}

      <button className={styles.button} type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Cadastrando..." : "Cadastrar album"}
      </button>
    </form>
  );
}

export default AlbumForm;
