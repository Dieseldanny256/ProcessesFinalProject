import React, { CSSProperties } from "react";

const app_name = 'powerleveling.xyz';
function buildPath(route: string): string {
  if (process.env.NODE_ENV !== 'development') {
    return 'http://' + app_name + ':5000/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}

interface ConfirmDelete {
  date: string,
  index: number,
  showPanel: (visible: boolean) => void,
  panelVisible: boolean
}

const ConfirmDelete: React.FC<ConfirmDelete> = ({ date, index, showPanel, panelVisible }) => {

  const deleteExercise = async () => {
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    try {
      if (index === -1) return;

      const response = await fetch(buildPath(`api/workouts/${userId}/${date}/${index}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (!data.message) {
        alert("Failed to delete exercise.");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to delete exercise.");
    }
  };

  const outerContainer: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    display: panelVisible ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "2vw",
    boxSizing: "border-box"
  };

  return (
    <div style={outerContainer} id="editExercisePanel">
      <div style={boxOutline}>
        <div style={boxInside}>
          <h1 style={header}>Confirm Deletion</h1>
          <span style={text}>Are you sure you want to delete this workout, bro?</span>
          <div style={buttonRow}>
            <button
              style={{ ...buttonBase, ...greenButton }}
              onMouseEnter={e => applyHoverEffect(e.currentTarget)}
              onMouseLeave={e => removeHoverEffect(e.currentTarget)}
              onClick={async () => { await deleteExercise(); showPanel(false); }}
            >
              DESTROY IT!
            </button>
            <button
              style={{ ...buttonBase, ...redButton }}
              onMouseEnter={e => applyHoverEffect(e.currentTarget)}
              onMouseLeave={e => removeHoverEffect(e.currentTarget)}
              onClick={() => showPanel(false)}
            >
              No, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const boxInside: CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#fff0f0",
  padding: "3vh 2vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  clipPath: "polygon(1% 1.5%, 94% 1.5%, 99% 98.5%, 6% 98.5%)",
  boxSizing: "border-box"
};

const boxOutline: CSSProperties = {
  backgroundColor: "black",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "min(90vw, 500px)",
  height: "min(50vh, 300px)",
  minWidth: "300px",
  minHeight: "200px",
  clipPath: "polygon(0 0, 95% 0%, 100% 100%, 5% 100%)"
};

const header: CSSProperties = {
  color: "black",
  fontFamily: "microgramma-extended, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(18px, 3.5vw, 32px)",
  marginBottom: "1vh",
  textAlign: "center"
};

const text: CSSProperties = {
  color: "black",
  fontFamily: "purista-web, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(14px, 2vw, 22px)",
  textAlign: "center",
  marginBottom: "4vh"
};

const buttonRow: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: "2vw",
  justifyContent: "center",
  flexWrap: "wrap"
};

const buttonBase: CSSProperties = {
  padding: "1vh 2vw",
  fontSize: "clamp(12px, 1.5vw, 18px)",
  fontWeight: "bold",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "transform 0.2s ease, filter 0.2s ease",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};

const redButton: CSSProperties = {
  backgroundColor: "#dc3545",
  color: "white"
};

const greenButton: CSSProperties = {
  backgroundColor: "#28a745",
  color: "white"
};

function applyHoverEffect(el: HTMLElement) {
  el.style.transform = "scale(1.05)";
  el.style.filter = "brightness(1.2)";
}

function removeHoverEffect(el: HTMLElement) {
  el.style.transform = "scale(1)";
  el.style.filter = "brightness(1)";
}

export default ConfirmDelete;
