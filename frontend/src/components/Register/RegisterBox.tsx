import React, { ReactNode, CSSProperties } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface AngledBoxProps {
  children: ReactNode;
}

const RegisterBox: React.FC<AngledBoxProps> = ({ children }) => {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login");
  };

  return (

    <div style={containerStyle}>
      <div style={backgroundBoxStyle}>
        <div style={angledBoxStyle}>{children}</div>
      </div>
      <button className="button" style={buttonStyle} onClick={handleRedirect}>
        LOGIN HERE!
      </button>
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

  const buttonStyle: CSSProperties = {

    marginTop: "2vh",
    width: "70%",
    padding: "1vh",
    textAlign: "center",
    backgroundColor: "#FFB202",
    border: ".7vh solid Black",
    borderRadius: "2px",
    cursor: "pointer",
  };

export default RegisterBox;
