import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Discover from "./pages/Discover";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import AskZ31 from "./pages/AskZ31";
import MainLayout from "./pages/MainLayout";
import LandingLayout from "./pages/LandingLayout";
import AccountPage from "./UserMenu/Accounts";
import Footer from "./Footer/Footer"; // Add this import
import { AuthProvider } from "./ProfilePage/Components/BackendAuthContext";
import { WatchlistProvider } from "./DiscoverPage/Components/WatchlistFunctionality";
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
  },
});

function App() {
  // Force stable scrollbar after everything loads
  React.useEffect(() => {
    const forceStableScrollbar = () => {
      // Force scrollbar to always be visible
      document.documentElement.style.setProperty('overflow-y', 'scroll', 'important');
      document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
      
      // Also set on body to be extra sure
      document.body.style.setProperty('overflow-x', 'hidden', 'important');
    };

    // Run immediately
    forceStableScrollbar();
    
    // Run again after delays to override any late-loading styles
    const timeouts = [
      setTimeout(forceStableScrollbar, 100),
      setTimeout(forceStableScrollbar, 500),
      setTimeout(forceStableScrollbar, 1000)
    ];
    
    // Also run on window resize
    window.addEventListener('resize', forceStableScrollbar);
    
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', forceStableScrollbar);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <WatchlistProvider>
          <Router>
            <Routes>
              <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />

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
              <Route path="/ask-z31" element={<AskZ31 />} />
            </Routes>
            {/* Add Footer here for all pages */}
          </Router>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;