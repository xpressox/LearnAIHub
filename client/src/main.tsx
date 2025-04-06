import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Providers from "./providers";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
