import React, { CSSProperties, useEffect, useState } from "react";

const app_name = 'powerleveling.xyz';
function buildPath(route: string): string {
  if (process.env.NODE_ENV !== 'development') {
    return 'http://' + app_name + ':5000/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}

interface Exercise {
  _id: number;
  name: string;
  category: string;
  __v: number;
}

interface EditWorkoutPanelProps {
  date: string;
  index: number;
  showPanel: (visible: boolean) => void;
  panelVisible: boolean;
  exerciseType: {
    exerciseId: Exercise;
    sets: number;
    reps: number;
    _id: number;
  };
  setExerciseType: React.Dispatch<React.SetStateAction<{
    exerciseId: Exercise;
    sets: number;
    reps: number;
    _id: number;
  }>>;
}

const EditWorkoutPanel: React.FC<EditWorkoutPanelProps> = ({
  date,
  index,
  showPanel,
  panelVisible,
  exerciseType,
  setExerciseType
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch(buildPath('api/exercises'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();
        setExercises(res);
      } catch (error: any) {
        alert(error.toString());
      }
    }

    loadExercises();
  }, []);

  const saveButtonStyle: CSSProperties = {
    fontFamily: "microgramma-extended, sans-serif",
    backgroundColor: "#00b300",
    color: "white",
    fontWeight: "600",
    fontSize: "1.1rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.1s ease",
    marginRight: "10px"
  };
  
  const [isHoveringSave, setIsHoveringSave] = useState(false);
  
  const enhancedSaveButtonStyle: CSSProperties = {
    ...saveButtonStyle,
    backgroundColor: isHoveringSave ? "#009900" : "#00b300",
  };
  
  const closeButtonStyle: CSSProperties = {
    fontFamily: "microgramma-extended, sans-serif",
    backgroundColor: '#cc0000',
    color: 'white',
    fontWeight: "600",
    fontSize: "1.1rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  };

  const handleSetType = (exercise: Exercise) => {
    const setsInput = document.getElementById("setsInput") as HTMLInputElement;
    const repsInput = document.getElementById("repsInput") as HTMLInputElement;

    const currentSets = setsInput ? parseInt(setsInput.value) || 0 : 0;
    const currentReps = repsInput ? parseInt(repsInput.value) || 0 : 0;

    setExerciseType(prev => ({
      ...prev,
      exerciseId: exercise,
      sets: currentSets,
      reps: currentReps
    }));

    setDropdownVisible(false);
  };

  const [isHoveringClose, setIsHoveringClose] = useState(false);

  const enhancedCloseButtonStyle: CSSProperties = {
    ...closeButtonStyle,
    backgroundColor: isHoveringClose ? '#990000' : '#cc0000'
  };

  const editExercise = async () => {
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    try {
      if (exerciseType.exerciseId._id === -1) return;

      const obj = { exercise: { exerciseId: exerciseType.exerciseId._id, sets: exerciseType.sets, reps: exerciseType.reps } };
      const js = JSON.stringify(obj);
      const response = await fetch(buildPath(`api/workouts/update/${userId}/${date}/${index}`), {
        method: 'PUT',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!data.message) alert("Failed to edit exercise.");
    } catch (err) {
      console.error(err);
      alert("Failed to edit exercise.");
    }
  };

  const addExercise = async () => {
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    try {
      if (exerciseType.exerciseId._id === -1) return;

      const obj = { exercises: [{ exerciseId: exerciseType.exerciseId._id, sets: exerciseType.sets, reps: exerciseType.reps }] };
      const js = JSON.stringify(obj);
      const response = await fetch(buildPath(`api/workouts/add/${userId}/${date}`), {
        method: 'PUT',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!data.message) alert("Failed to add exercise.");
    } catch (err) {
      console.error(err);
      alert("Failed to add exercise.");
    }
  };

  async function saveChanges() {
    const menu = document.getElementById("editExercisePanel");
    if (menu) menu.style.display = "none";

    if (exerciseType._id === -1) {
      await addExercise();
    } else {
      await editExercise();
    }

    showPanel(false);
  }

  function handleSetReps(e: any): void {
    const newReps = Math.max(0, parseInt(e.target.value));
    setExerciseType(prev => ({ ...prev, reps: newReps }));
  }

  function handleSetSets(e: any): void {
    const newSets = Math.max(0, parseInt(e.target.value));
    setExerciseType(prev => ({ ...prev, sets: newSets }));
  }

  // Styles
  const outerContainer: CSSProperties = {
    position: "fixed", top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0, 0, 0, 0.6)",
    display: panelVisible ? "flex" : "none",
    justifyContent: "center", alignItems: "center",
    zIndex: 1000
  };

  const boxOutline: CSSProperties = {
    backgroundColor: "black", width: "90%", maxWidth: "600px",
    borderRadius: "16px", padding: "1px",
    clipPath: "polygon(0 0, 95% 0%, 100% 100%, 5% 100%)"
  };

  const boxInside: CSSProperties = {
    background: "#fff0f0", padding: "32px",
    clipPath: "polygon(1% 1.5%, 94% 1.5%, 99% 98.5%, 6% 98.5%)",
    display: "flex", flexDirection: "column", gap: "20px"
  };

  const header: CSSProperties = {
    color: "black", fontFamily: "microgramma-extended, sans-serif",
    fontWeight: "700", fontSize: "2rem", marginBottom: "1rem", textAlign: "center"
  };

  const text: CSSProperties = {
    fontFamily: "microgramma-extended, sans-serif",
    fontWeight: "600", fontSize: "1rem", marginBottom: "0.5rem",
    display: "block", color: 'black'
  };

  const inputStyle: CSSProperties = {
    padding: "6px 12px", fontSize: "1.2vw",
    borderRadius: "6px", border: "1px solid #aaa", width: "50%", 
  };

  const buttonStyle: CSSProperties = {
    color: "black",
    padding: "6px 12px", fontSize: "1.2vw",
    borderRadius: "6px", border: "1px solid #888",
    backgroundColor: "#ffffff", cursor: "pointer"
  };

  const dropdownStyle: CSSProperties = {
    display: dropdownVisible ? "block" : "none",
    color: "black",
    position: "absolute", background: "#fff",
    border: "2px solid black", boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    zIndex: 1001, maxHeight: "200px", overflowY: "auto",
    width: "100%", top: "100%", left: "0", borderRadius: "8px"
  };

  const rowStyle: CSSProperties = {
    color: "black", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", position: "relative"
  };

  return (
    <div style={outerContainer} id="editExercisePanel">
      <div style={boxOutline}>
        <div style={boxInside}>
          <h1 style={header}>Modify Exercise</h1>

          <div style={{
            backgroundColor: "#e0e0e0",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={rowStyle}>
              <label style={text}>Type:</label>
              <div style={{ position: "relative", width: "50%" }}>
                <button style={buttonStyle} onClick={() => setDropdownVisible(!dropdownVisible)}>
                  {exerciseType.exerciseId._id === -1 ? "[Select]" : exerciseType.exerciseId.name}
                </button>
                <div style={dropdownStyle}>
                  {exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="dropdownContent"
                      onClick={() => handleSetType(exercise)}
                    >
                      {exercise.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={rowStyle}>
              <label style={text}>Sets:</label>
              <input id="setsInput" type="number" style={inputStyle} onChange={handleSetSets} value={exerciseType.sets ?? ''} />
            </div>

            <div style={rowStyle}>
              <label style={text}>Reps:</label>
              <input id="repsInput" type="number" style={inputStyle} onChange={handleSetReps} value={exerciseType.reps ?? ''} />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", gap: "16px" }}>
            <button
              style={enhancedSaveButtonStyle}
              onClick={saveChanges}
              onMouseEnter={() => setIsHoveringSave(true)}
              onMouseLeave={() => setIsHoveringSave(false)}
            >
              Save Changes
            </button>

            <button
              style={enhancedCloseButtonStyle}
              onClick={() => showPanel(false)}
              onMouseEnter={() => setIsHoveringClose(true)}
              onMouseLeave={() => setIsHoveringClose(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutPanel;
