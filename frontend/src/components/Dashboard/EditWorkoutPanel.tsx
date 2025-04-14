import React, { CSSProperties, useEffect } from "react";

let exercises = new Array();

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

interface EditWorkoutPanel
{
    date : string,
    index : number,
    showPanel : (visible : boolean) => void,
    panelVisible : boolean
}

const EditWorkoutPanel: React.FC<EditWorkoutPanel> = ({ date, index, showPanel, panelVisible }) => {
  const [sets, setSets] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [type, setType] = React.useState({_id:-1, name: "Select Workout", category: "", __v: -1});

  useEffect(() => {loadExercises()}, []);
  console.log(date);
  console.log(index);

  const outerContainer: CSSProperties = {
    position : "absolute",
    width : "100%",
    height : "100%",
    background : "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    display : panelVisible ? "block" : "none"
  }

  const addExercise = async () => {
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
        if (type._id == -1)
        {
            return;
        }

        var obj = {exercises: [{exerciseId: type._id, sets: sets, reps: reps}]};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath(`api/workouts/${userId}/${date}/add`), {method:'PUT',body:js,headers:{'Content-Type':'application/json'}});
        const data = await response.json();

        if (data.message == null)
        {
            alert("Failed to add exercise.");
        }
        
    } catch (err) {
        console.error(err);
        alert("Failed to add exercise.");
    }           
  };

  async function saveChanges()
  {
    let menu = document.getElementById("editExercisePanel");
    if (menu != null)
    {
        menu.style.display = "none";
    }
    await addExercise();
    showPanel(false);
  }

  return (
    <div style = {outerContainer} id = "editExercisePanel">
      <div style = {boxOutline}>
        <div style = {boxInside}>
            <h1 style = {header}>Modify Exercise</h1>
            <div>
                <span style = {text}>Type:</span>
                <button id="typeButton" onClick={toggleDropdown}>{type.name}</button>
                <div id="dropdown" style={dropdown}></div>
            </div>
            <div>
                <span style = {text}>Sets</span>
                <input onChange={handleSetSets} type="number"></input>
            </div>
            <div>
                <span style = {text}>Reps</span>
                <input onChange={handleSetReps} type="number"></input>
            </div>
            <button onClick={saveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  );

  function handleSetReps( e: any ) : void
  {
    setReps( e.target.value );
  }

  function handleSetSets( e: any ) : void
  {
    setSets( e.target.value );
  }

  function handleSetType(index : any)
{
    //Update the type button
    setType(exercises[index]);

    //Hide the dropdown
    let dropdown = document.getElementById("dropdown");
    if (dropdown != null){dropdown.style.display = "none";}
}

async function loadExercises() : Promise<void>
{
  try
  {
      //Get the API response
      const response = await fetch(buildPath('api/exercises'),
      {method:'GET',headers:{'Content-Type':'application/json'}});
      var res = JSON.parse(await response.text());
      exercises = res;
  }
  catch(error:any)
  {
    alert(error.toString());
    return;
  }

  //Populate the html string
  for (let i = 0; i < exercises.length; i++)
  {
    let dropdownItem = document.createElement("a");
    dropdownItem.id = "" + i;
    dropdownItem.className = "dropdownContent";
    dropdownItem.innerHTML = exercises[i].name;
    dropdownItem.onclick = function() {handleSetType(i);}

    let dropdown = document.getElementById("dropdown");
    if (dropdown != null) 
    {
        dropdown.appendChild(dropdownItem);
    }
  }
};
};

function toggleDropdown()
{
    let dropdown = document.getElementById("dropdown");
    if (dropdown != null)
    {
        if(dropdown.style.display == "none")
        {
            dropdown.style.display = "block";
        }
        else
        {
            dropdown.style.display = "none";
        }
    }
}

const boxInside: CSSProperties = {
  display: "block",
  justifyContent: "center",
  width: "50vw",
  minHeight: "70vh",
  background: "#fff0f0",
  margin: "auto",
  marginTop: "10vh",
  clipPath: "polygon(1% 1.5%, 94% 1.5%, 99% 98.5%, 6% 98.5%)",
}

const boxOutline: CSSProperties = {
    justifyContent: "center",
    marginTop: "10vh",
    backgroundColor: "black",
    display: "block",
    width: "50vw",
    minHeight: "70vh",
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
    margin: "1.5vh"
}

const text: CSSProperties = {
    color: "black",
    fontFamily: "purista-web, sans-serif",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "1.5vw"
}

const dropdown: CSSProperties = {
    display: "none",
    position: "absolute",
    background: "#fff0f0",
    borderColor: "black",
    borderWidth: "5px",
    borderStyle: "solid",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    left: "46%",
    maxHeight: "40vh",
    overflow: "auto"
}

export default EditWorkoutPanel;