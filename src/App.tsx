import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Discover from "./pages/Discover";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import APIPlatform from "./pages/APIPlatform";
import MainLayout from "./pages/MainLayout";
import LandingLayout from "./pages/LandingLayout";
import { AuthProvider } from "./ProfilePage/Components/BackendAuthContext";
import { WatchlistProvider } from "./DiscoverPage/WatchlistFunctionality";
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
  },
  palette: {
    primary: {
      main: "#ffa500", // Orange hex value instead of "orange"
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <WatchlistProvider>
          <Router>
            <Routes>
              {/* 🔹 Landing with isolated layout */}
              <Route
                path="/landing"
                element={
                  <LandingLayout>
                    <Landing />
                  </LandingLayout>
                }
              />

              {/* 🔸 All other pages with navbar + padding */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Discover />
                  </MainLayout>
                }
              />
              <Route
                path="/analytics/:username"
                element={
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                }
              />
              <Route
                path="/api-platform"
                element={
                  <MainLayout>
                    <APIPlatform />
                  </MainLayout>
                }
              />
            </Routes>
          </Router>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
