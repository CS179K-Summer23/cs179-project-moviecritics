import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./app.js";
import MovieshowerFromInterests from "./interestsFromSurvey.js";

export default function Home() {
  return (
    <>
        <title>MovieCritics</title>
        <meta name="description" content="Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="" />
        <MovieshowerFromInterests />
        
    </>
  );
}


