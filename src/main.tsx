import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

/* Mark the document before the first render. The CSS only hides a section
   for its entrance once this is set, so nothing can be left invisible. */
document.documentElement.setAttribute("data-js", "true");

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root was not found.");

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
