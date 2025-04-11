import React, { CSSProperties } from "react";

const EditWorkoutPanel: React.FC = () => {

  return (
    <div style = {outerContainer}>
      <h1 id = "month" style = {month}></h1>
      <div style = {container}>
        <button className="button" style={button}>&lt;</button>
        <table style = {table}>
            <tbody><tr>
            </tr></tbody>
        </table>
        <button className="button" style={button}>&gt;</button>
      </div>
    </div>
  );
};

const outerContainer: CSSProperties = {
  justifyContent: "left"
}

const container: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
}

const table: CSSProperties = {
  backgroundColor: " #fff0f0",
  borderColor: " #000000",
  borderCollapse: "collapse",
  borderWidth: "5px",
  borderStyle: "solid",
  width: "80vw",
  height: "25vh",
  tableLayout: "fixed"
}

const button: CSSProperties = {
  marginTop: "2vh",
  width: "10vw",
  fontSize: "5vw",
  padding: "1vh",
  textAlign: "center",
  cursor: "pointer",
  background: "none"
};

const month: CSSProperties = {
  color: "black",
  fontFamily: "microgramma-extended, sans-serif",
  fontWeight: "700",
  fontStyle: "normal",
  fontSize: "3vw"
}

export default EditWorkoutPanel;