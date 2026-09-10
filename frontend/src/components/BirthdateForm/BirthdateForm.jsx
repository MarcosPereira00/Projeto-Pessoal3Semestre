// Campo de data de nascimento. No submit extrai so o mes (parte do meio do
// "AAAA-MM-DD") e repassa pra pagina via onSearch.
import { useState } from "react";
import styles from "./BirthdateForm.module.css";

function BirthdateForm({ onSearch }) {
  const [birthdate, setBirthdate] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!birthdate) return;

    const month = Number(birthdate.split("-")[1]); // "2000-05-15" -> 5
    onSearch(month, birthdate);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="birthdate">
        Qual a sua data de nascimento?
      </label>

      <div className={styles.row}>
        <input
          id="birthdate"
          type="date"
          className={styles.input}
          value={birthdate}
          onChange={(event) => setBirthdate(event.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Ver albuns do meu mes
        </button>
      </div>
    </form>
  );
}

export default BirthdateForm;
