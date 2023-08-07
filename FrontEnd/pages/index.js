import React, {useState} from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./app.js";
import MovieRating from "./MovieRating.js";
import MovieshowerFromInterests from "./interestsFromSurvey.js";
import AccountCreation from "./accountCreation.js";
import UserSurveyApp from "./UserSurvey.js";



export default function Home() {
  
  const [accountCreated, setAccountCreated] = useState(false);

  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleAccountCreationSuccess = () => {
    setAccountCreated(true);
  };

  const handlesurverySubmit = () => {
    setSurveySubmitted(true);
  };
  return (
    <>
    
        <title>MovieCritics</title>
        <meta name="description" content="Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="" />
        {/* <AccountCreation /> /}
        {/ If account isn't created, display accountCreation */}
        {!accountCreated && <AccountCreation onSuccess={handleAccountCreationSuccess} />}

        {/* If Account is created, show UserSurvey */}
        {accountCreated && (
          <>
            <UserSurveyApp jsonfile onSuccess={handlesurverySubmit} />
          </>
        )}
        {accountCreated && surveySubmitted && (
          <>
            <MovieshowerFromInterests jsonfile/>
          </>
        )}
        {/* <MovieshowerFromInterests />
        <MovieRating /> */}
    </>
  );
}
