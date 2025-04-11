import React, { CSSProperties } from "react";
//import { useNavigate } from "react-router-dom";

const date = new Date();
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbrreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

let days = new Array(7).fill("");
let currentWeekOffset = 0;
let selectedDate = new Date();
let weekExcercises = [];

let _ud : any = localStorage.getItem('user_data');
let userId : any = null;
if (_ud)
{
  let ud = JSON.parse( _ud );
  userId = ud.userId;
}

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

function getDateString(date : Date)
{
  let string = date.getFullYear() + "-";
  let month = (date.getMonth() + 1).toString();
  if (month.length < 2) {month = "0" + month;}
  let day = (date.getDate()).toString();
  if (day.length < 2) {day = "0" + day;}
  string = string + month + "-" + day;

  return string;
}

// Handle Login
async function loadWeekExercises(event:any) : Promise<void>
{
  event.preventDefault();
  
  //Get the previous Sunday
  let currentDay = date.getDay(); //Gets the offset from Sunday
  let sunDate = new Date();
  sunDate.setDate(date.getDate() - currentDay + 7 * currentWeekOffset);
  let currentDate = new Date();
  currentDate.setTime(sunDate.getTime());

  let exerciseHtmls = new Array<string>();

  //Iterate over each day and generate an appropriate date string
  for (let i = 0; i < 7; i++)
  {
    let dateString = getDateString(currentDate);

    try
    {
        //Get the API response
        if (userId == null)
        {
          alert("Unable to Load Excercises!");
          return;
        }

        const response = await fetch(buildPath('api/workouts/' + userId + '/' + dateString + '/exercises'),
        {method:'GET',headers:{'Content-Type':'application/json'}});
        var res = JSON.parse(await response.text());

        let htmlString = "<span>" + dayNames[i] + "</span><br><span>" + monthAbrreviations[currentDate.getMonth()] + " " + currentDate.getDate() + "</span><br>";
        if (res.hasOwnProperty('exercises'))
        {
          weekExcercises = res.exercises;
          for (let i = 0; i < res.exercises.length; i++) 
          {
            if (i >= 3) {break;}
            htmlString += "<div class=\"calendarItem\"><span>" + 
              res.exercises[i].exerciseId.name + "</span><br><span>" + res.exercises[i].reps + " " + res.exercises[i].sets + "</span></div>";
          }
        }
        exerciseHtmls.push(htmlString);
    }
    catch(error:any)
    {
      alert(error.toString());
      return;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  //Set the month
  let month = document.getElementById("month");
  if (month != null) 
  {
    month.innerHTML = monthNames[sunDate.getMonth()] + " " + sunDate.getFullYear();
  }

  for (let i = 0; i < 7; i++)
  {
    //Update table values
    let cell = document.getElementById("cell" + i);
    if (cell != null)
    {
      cell.style.borderColor = " rgb(0, 0, 0)";
      cell.style.borderWidth = "2px";
      
      cell.innerHTML = exerciseHtmls[i];
      if (currentWeekOffset == 0 && i == currentDay)
      {
        cell.style.color =  "rgb(0, 0, 0)";
        cell.style.background = "none";
      }
      else if (currentWeekOffset <= 0 && (currentWeekOffset < 0 || i < currentDay))
      {
        cell.style.color =  "rgb(57, 51, 51)";
        cell.style.backgroundColor = "rgb(180, 168, 168)";
      }
      else
      {
        cell.style.color =  "rgb(0, 0, 0)";
        cell.style.background = "none";
      }

      if (checkDateEquality(sunDate, selectedDate))
      {
        cell.style.borderColor = " #FFB202";
        cell.style.borderWidth = "5px";
      }
    }

    sunDate.setDate(sunDate.getDate() + 1); //Proceed to the next date
  }
};

const Calendar: React.FC = () => {
  //const navigate = useNavigate();
  window.onload = (event): void => {loadWeekExercises(event)};

  return (
    <div style = {outerContainer}>
      <h1 id = "month" style = {month}></h1>
      <div style = {container}>
        <button className="button" style={button} onClick={previousWeek}>&lt;</button>
        <table style = {table}>
          <tbody><tr>
              <td id = "cell0" className = "calendarCell" onClick = {function(){select(0)}}>Sun-{days[0]}</td>
              <td id = "cell1" className = "calendarCell" onClick = {function(){select(1)}}>Mon-{days[1]}</td>
              <td id = "cell2" className = "calendarCell" onClick = {function(){select(2)}}>Tue-{days[2]}</td>
              <td id = "cell3" className = "calendarCell" onClick = {function(){select(3)}}>Wed-{days[3]}</td>
              <td id = "cell4" className = "calendarCell" onClick = {function(){select(4)}}>Thu-{days[4]}</td>
              <td id = "cell5" className = "calendarCell" onClick = {function(){select(5)}}>Fri-{days[5]}</td>
              <td id = "cell6" className = "calendarCell" onClick = {function(){select(6)}}>Sat-{days[6]}</td>
            </tr></tbody>
        </table>
        <button className="button" style={button} onClick={nextWeek}>&gt;</button>
      </div>
    </div>
  );
};

function previousWeek(e : any) {
  currentWeekOffset -= 1;
  loadWeekExercises(e);
}

function nextWeek(e : any) {
  currentWeekOffset += 1;
  loadWeekExercises(e);
}

function select(cellNum : any)
{
  //Reset the formatting of the previously selected cell and update the new cell
  let cell = document.getElementById("cell" + selectedDate.getDay());
  if (cell != null)
  {
    cell.style.borderColor = " #000000";
    cell.style.borderWidth = "2px";
  }
  let newCell = document.getElementById("cell" + cellNum);
  if (newCell != null)
  {
    newCell.style.borderColor = " #FFB202";
    newCell.style.borderWidth = "5px";
  }

  //Get the date object representing the date the user just clicked
  selectedDate = new Date();
  selectedDate.setDate(selectedDate.getDate() + currentWeekOffset * 7 + cellNum - date.getDay());
}

function checkDateEquality(date1 : Date, date2 : Date)
{
  if (date1.getDate() != date2.getDate()) {return false;}
  if (date1.getMonth() != date2.getMonth()) {return false;}
  if (date1.getFullYear() != date2.getFullYear()) {return false;}
  return true;
}

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

export default Calendar;