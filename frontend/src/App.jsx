// Componente raiz. Sem biblioteca de rotas: um estado `view` guarda qual
// pagina esta aberta e o Header troca esse valor pelos botoes do menu.
import { useState } from "react";
import Header from "./components/Header/Header.jsx";
import DescobrirPage from "./pages/DescobrirPage/DescobrirPage.jsx";
import CadastrarPage from "./pages/CadastrarPage/CadastrarPage.jsx";
import FavoritosPage from "./pages/FavoritosPage/FavoritosPage.jsx";
import ContaPage from "./pages/ContaPage/ContaPage.jsx";
import styles from "./App.module.css";

// mapa "nome da view" -> componente de pagina
const PAGES = {
  descobrir: DescobrirPage,
  cadastrar: CadastrarPage,
  favoritos: FavoritosPage,
  conta: ContaPage,
};

function App() {
  const [view, setView] = useState("descobrir");

  const Page = PAGES[view] || DescobrirPage;

  return (
    <div className={styles.app}>
      <Header view={view} onChangeView={setView} />

      <main className={styles.main}>
        {/* a pagina de cadastro precisa de um jeito de mandar o usuario pro login */}
        {view === "cadastrar" ? (
          <CadastrarPage onNavigateToConta={() => setView("conta")} />
        ) : (
          <Page />
        )}
      </main>

      <footer className={styles.footer}>
        <p>Trilha de Nascimento - projeto de Programacao Web</p>
      </footer>
    </div>
  );
}

export default App;
