import React from "react";
import DisplayMessage from "./components/DisplayMessage";
import AddMessage from "./components/AddMessage";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#f9a822",
      },
      background: {
        default: "#1a1a2e",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DisplayMessage></DisplayMessage>
        <AddMessage></AddMessage>
      </Container>
    </ThemeProvider>
  );
}

export default App;