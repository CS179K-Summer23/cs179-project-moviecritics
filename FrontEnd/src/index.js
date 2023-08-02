import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./app.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
