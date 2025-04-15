
import React, { ReactNode } from "react";
import backGround from "../../assets/BackGround.png";

interface BackgroundProps {
  children: ReactNode;
}

const BackGround : React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${backGround})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100%",
        minWidth: "100%"
      }}>
        {children}
    </div>
  );
};

export default BackGround;
