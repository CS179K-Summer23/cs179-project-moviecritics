import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Link } from "@mui/material";
import { Box } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function HomeAccount() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8002/news")
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
          alignItems: "center",
          width: "900px",
          borderRadius: 8,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h1>Home Page</h1>
      </Box>
      <Container
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 8,
          padding: "20px",
          backgroundColor: "#333",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, color: "white" }}>
          Latest News
        </Typography>
        {news.map((article, index) => (
          <Container
            key={index}
            sx={{
              marginBottom: 4,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            <Typography variant="h5">{article.title}</Typography>
            <img
              src={article.urlToImage} // Display the article image
              alt={article.title}
              style={{ maxWidth: "100%", height: "auto", marginBottom: 10 }}
            />
            <Typography>{article.description}</Typography>
            <Link href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </Link>
          </Container>
        ))}
      </Container>
    </ThemeProvider>
  );
}

export default HomeAccount;
