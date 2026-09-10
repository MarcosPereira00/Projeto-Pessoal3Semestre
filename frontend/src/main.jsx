// Arquivo que o Vite carrega primeiro. Pega a div #root do index.html e
// renderiza o App dentro dela. O AuthProvider por fora deixa o estado de
// login disponivel para qualquer componente.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
