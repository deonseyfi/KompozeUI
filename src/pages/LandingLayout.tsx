import React from "react";
import ResponsiveAppBar from "../AppBar"; // make sure this path is correct
import "../pages/Landing.css"; // scoped landing page styles

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="landing-page">
      <ResponsiveAppBar />
      {children}
    </div>
  );
};

export default LandingLayout;