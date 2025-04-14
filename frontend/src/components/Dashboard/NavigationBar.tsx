import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar: React.FC = () => {

  const navigate = useNavigate();

  const handleRedirectLogout = (event:any) => {
    event.preventDefault();
    localStorage.removeItem("user_data")
    navigate("/login");
  };

  const handleRedirectLeaderboard = (event:any) => {
    event.preventDefault();
    navigate("/leaderboard");
  };

  const handleRedirectProfile = (event:any) => {
    event.preventDefault();
    navigate("/profile");
  };

  return (
    <div style={container}>
      <button className="button" style={button} onClick={handleRedirectLogout}>&#60;</button>
      <span>Dashboard</span>
      <button className="button" style={button} onClick={handleRedirectLeaderboard}>Leaderboard</button>
      <button className="button" style={button} onClick={handleRedirectProfile}>Profile</button>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: " #fff0f0",
    borderColor: "rgb(0, 0, 0)",
    borderWidth: "5px",
    borderStyle: "solid"
}

const button: CSSProperties = {

    marginTop: "2vh",
    width: "70%",
    padding: "1vh",
    textAlign: "center",
    backgroundColor: "#FFF0F0",
    borderLeft: ".7vh solid #BBAFAE",
    borderRight: ".7vh solid #BBAFAE",
    borderRadius: "2px",
    cursor: "pointer",
};

export default NavigationBar;