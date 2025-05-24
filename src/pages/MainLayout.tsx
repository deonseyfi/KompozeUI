import React from "react";
import ResponsiveAppBar from "../AppBar";
import CryptoTickerBar from '../ProfilePage/Components/CryptoTicker'; // Add this import


const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CryptoTickerBar /> 
      <ResponsiveAppBar />
      <div style={{ padding: "24px", minHeight: "100vh", overflow: "auto" }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;