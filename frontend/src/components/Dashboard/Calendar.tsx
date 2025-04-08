import React, { CSSProperties } from "react";
//import { useNavigate } from "react-router-dom";

const NavigationBar: React.FC = () => {

  //const navigate = useNavigate();

  return (
    <div style={container}>
      <table>
        <tr>
            <td>1 - Mon</td>
            <td>2 - Tue</td>
            <td>3 - Wed</td>
            <td>4 - Thurs</td>
            <td>5 - Fri</td>
        </tr>
      </table>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: " #fff0f0",
    borderColor: " #000000",
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