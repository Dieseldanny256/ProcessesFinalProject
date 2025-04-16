import React, { ReactNode, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

interface AngledBoxProps {
  children: ReactNode;
}

const ForgotPasswordBox: React.FC<AngledBoxProps> = ({ children }) => {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login");
  };

  return (

    <div style={container}>
      <div style={outLine}>
        <div style={BoxStyle}>{children}</div>
      </div>
      <button className="button" style={button} onClick={handleRedirect}>
        RETURN
      </button>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transform: "translateX(10%)",
  }

const outLine: CSSProperties = {
    backgroundColor: "black",
    padding: "1vh",
    display: "flex",
    minHeight: "10vh",
    clipPath: "polygon(0 0, 100% 0%, 70% 100%, 0% 100%)",
    flexDirection: "column",
  }

const BoxStyle: CSSProperties = {
    backgroundColor: "white",
    padding: "0vh",
    width: "45vw",
    position: "relative",
    clipPath: "polygon(0 0, 99.2% 0%, 69.5% 100%, 0% 100%)",
  }

  const button: CSSProperties = {

    marginTop: "2vh",
    width: "70%",
    padding: "1vh",
    textAlign: "center",
    backgroundColor: "#FFB202",
    border: ".7vh solid Black",
    borderRadius: "2px",
    cursor: "pointer",
  };

export default ForgotPasswordBox;
