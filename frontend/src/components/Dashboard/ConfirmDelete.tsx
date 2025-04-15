import React, { CSSProperties } from "react";

const app_name = 'powerleveling.xyz';
function buildPath(route:string) : string
{
  if (process.env.NODE_ENV != 'development')
  {
  return 'http://' + app_name + ':5000/' + route;
  }
  else
  {
  return 'http://localhost:5000/' + route;
  }
}

interface ConfirmDelete
{
    date : string,
    index : number,
    showPanel : (visible : boolean) => void,
    panelVisible : boolean
}

const ConfirmDelete: React.FC<ConfirmDelete> = ({ date, index, showPanel, panelVisible }) => {

  const deleteExercise = async () => {
    //setLoading(true);
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
        alert("User not logged in.");
        //setLoading(false);
        return;
    }
    const userData = JSON.parse( _userData );
    const userId = userData.userId;

    try {
        //Index needs to be a valid index
        if (index == -1)
        {
            return;
        }

        const response = await fetch(buildPath(`api/workouts/${userId}/${date}/${index}`), {method:'DELETE',headers:{'Content-Type':'application/json'}});
        const data = await response.json();

        if (data.message == null)
        {
            alert("Failed to delete exercise.");
        }
        
    } catch (err) {
        console.error(err);
        alert("Failed to delete exercise.");
    }           
  };

  const outerContainer: CSSProperties = {
    position : "fixed",
    width : "100%",
    height : "100%",
    background : "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    display : panelVisible ? "block" : "none",
    top: 0,
    left: 0,
    zIndex: 10
  }

  return (
    <div style = {outerContainer} id = "editExercisePanel">
      <div style = {boxOutline}>
        <div style = {boxInside}>
            <h1 style = {header}>Confirm Deletion</h1>
            <span style = {text}>Are you sure you want to delete this workout, bro?</span><br />
            <div>
              <button style = {{margin: "2vw"}} onClick = {() => {showPanel(false);}}>No, thanks!</button>
              <button style = {{margin: "2vw"}} onClick = {async () => {await deleteExercise(); showPanel(false);}}>DESTROY IT!</button>
            </div>
        </div>
      </div>
    </div>
  );
};

const boxInside: CSSProperties = {
  display: "block",
  justifyContent: "center",
  width: "30vw",
  minHeight: "50vh",
  background: "#fff0f0",
  margin: "auto",
  marginTop: "20vh",
  clipPath: "polygon(1% 1.5%, 94% 1.5%, 99% 98.5%, 6% 98.5%)",
}

const boxOutline: CSSProperties = {
    justifyContent: "center",
    marginTop: "20vh",
    backgroundColor: "black",
    display: "block",
    width: "30vw",
    minHeight: "50vh",
    margin: "auto",
    clipPath: "polygon(0 0, 95% 0%, 100% 100%, 5% 100%)",
    flexDirection: "column",
}

const header: CSSProperties = {
    color: "black",
    fontFamily: "microgramma-extended, sans-serif",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "3vw",
    margin: "2vh",
    marginTop: "10vh"
}

const text: CSSProperties = {
    color: "black",
    fontFamily: "purista-web, sans-serif",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "1.5vw"
}

export default ConfirmDelete;