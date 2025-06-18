import React from "react";
import ResponsiveAppBar from "../AppBar";
import Footer from "../Footer/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ResponsiveAppBar />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
