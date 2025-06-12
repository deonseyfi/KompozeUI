import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Discover from "./pages/Discover";
import Analytics from "./pages/Analytics";
import Dashboard from "./ProfilePage/Page/Dashboard"; // Add this import
import About from "./pages/About";
import AskZ31 from "./pages/AskZ31";
import MainLayout from "./pages/MainLayout";
import LandingLayout from "./pages/LandingLayout";
import { AuthProvider } from "./ProfilePage/Components/BackendAuthContext";
import { WatchlistProvider } from "./DiscoverPage/WatchlistFunctionality";
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: "#ff6b35", // Orange hex value instead of "orange"
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
              {/* Landing with isolated layout */}
              <Route
                path="/landing"
                element={
                  <LandingLayout>
                    <Landing />
                  </LandingLayout>
                }
              />
              {/* Discover page (home) */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Discover />
                  </MainLayout>
                }
              />
              {/* Analytics page (general) */}
              <Route
                path="/analytics"
                element={
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                }
              />
              {/* Dashboard page with username parameter */}
              <Route
                path="/analytics/:username"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              {/* About page */}
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                }
              />
              <Route
                path="/ask-z31"
                element={
                  
                    <AskZ31/>
                  
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
