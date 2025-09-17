// components/layouts/FrontLayout.tsx
import React from "react";
import NavBar from "../../NavBar/NavBar";

interface FrontLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const FrontLayout: React.FC<FrontLayoutProps> = ({
  children,
  fullWidth = false,
}) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};
