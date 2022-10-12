import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "degen";
import "degen/styles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <ThemeProvider defaultMode="dark" defaultAccent="purple">
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
