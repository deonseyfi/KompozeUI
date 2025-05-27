import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./DiscoverPage/WatchlistFunctionality";
import ResponsiveAppBar from "./AppBar";
import Landing from "./pages/Landing"; // stub file
import Discover from "./pages/Discover"; // NEW: you'll move StickyHeadTable here
import Analytics from "./pages/Analytics"; // stub file
import About from "./pages/About"; // stub file
// import APIPlatform from "./pages/APIPlatform";
import MainLayout from "./pages/MainLayout";
import LandingLayout from "./pages/LandingLayout";
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WatchlistProvider>
        <Router>
          <ResponsiveAppBar />
          <div style={{ padding: "24px" }}>
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App;