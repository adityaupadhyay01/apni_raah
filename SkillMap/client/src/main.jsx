import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </LanguageProvider>
  </BrowserRouter>
);
