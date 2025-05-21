import React from "react";
import ResponsiveAppBar from "../AppBar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ResponsiveAppBar />
      <div style={{ padding: "24px", minHeight: "100vh", overflow: "auto" }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;