import "./App.css";
import MainContent from "./Components/MainContent";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#f44336",
      },
      secondary: {
        main: "#3f51b5",
      },
    },
    typography: {
      fontFamily: "IBM Plex Sans Arabic",
    },
  });
  return (
    <ThemeProvider theme={theme}>
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >

      <Container maxWidth="xl">
        <MainContent />
      </Container>
    </div>
    </ThemeProvider>
  );
}

export default App;
