import React from "react";
import NavBar from "../../NavBar/NavBar";

interface FrontLayoutProps {
  children: React.ReactNode;
}

export const FrontLayout: React.FC<FrontLayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};
