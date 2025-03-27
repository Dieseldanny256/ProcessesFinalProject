import React, { ReactNode, CSSProperties } from "react";

interface AngledBoxProps {
  children: ReactNode;
}

const VerifyBox: React.FC<AngledBoxProps> = ({ children }) => {

  return (

    <div style={containerStyle}>
      <div style={backgroundBoxStyle}>
        <div style={angledBoxStyle}>{children}</div>
      </div>
    </div>
  );
};

const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "absolute",
    left: "3vw",
    top: "60%",
    transform: "translateY(-50%)",
  }

const backgroundBoxStyle: CSSProperties = {
    backgroundColor: "black",
    padding: "1vh",
    display: "flex",
    minHeight: "10vh",
    clipPath: "polygon(0 0, 100% 0%, 70% 100%, 0% 100%)",
    flexDirection: "column",
  }

const angledBoxStyle: CSSProperties = {
    backgroundColor: "white",
    padding: "0vh",
    width: "45vw",
    minHeight: "50vh",
    position: "relative",
    clipPath: "polygon(0 0, 99.2% 0%, 69.5% 100%, 0% 100%)",
  }

export default VerifyBox;
