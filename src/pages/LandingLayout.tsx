import React from 'react';
import LandingAppBar from '../LandingAppBar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <>
      <LandingAppBar />
      {children}
    </>
  );
};

export default LandingLayout;