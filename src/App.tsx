import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./AppBar";
import Discover from "./pages/Discover"; // NEW: you'll move StickyHeadTable here
import Analytics from "./pages/Analytics"; // stub file
import About from "./pages/About"; // stub file
import APIPlatform from "./pages/APIPlatform"; // stub file
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar />
        <div style={{ padding: "24px" }}>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
            <Route path="/api-platform" element={<APIPlatform />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
