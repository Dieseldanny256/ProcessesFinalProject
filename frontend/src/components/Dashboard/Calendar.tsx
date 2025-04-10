import React, { CSSProperties } from "react";
//import { useNavigate } from "react-router-dom";

const date = new Date();
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbrreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

let days = new Array(7).fill("");
let currentWeekOffset = 0;
let selectedDate = new Date();

const Calendar: React.FC = () => {
  //const navigate = useNavigate();
  window.onload = (): void => {loadWeek(currentWeekOffset)};
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

function previousWeek() {
  currentWeekOffset -= 1;
  loadWeek(currentWeekOffset);
}

function nextWeek() {
  currentWeekOffset += 1;
  loadWeek(currentWeekOffset);
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

function loadWeek(offset = 0) {
  //Get the previous Sunday
  let currentDay = date.getDay(); //Gets the offset from Sunday
  let sunDate = new Date();
  sunDate.setDate(date.getDate() - currentDay + 7 * offset);

  //Iterate over each day and generate an appropriate date string
  for (let i = 0; i < 7; i++)
  {
    days[i] = sunDate.getDate(); //Save the current date

    //Update table values
    let cell = document.getElementById("cell" + i);
    if (cell != null)
    {
      cell.style.borderColor = " rgb(0, 0, 0)";
      cell.style.borderWidth = "2px";
      cell.innerHTML = 
        "<span>" + dayNames[i] + "</span></br><span>" + monthAbrreviations[sunDate.getMonth()] + " " + days[i] + "</span>";
      if (offset == 0 && i == currentDay)
      {
        cell.style.color =  "rgb(0, 0, 0)";
        cell.style.background = "none";
      }
      else if (offset <= 0 && (offset < 0 || i < currentDay))
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
      sunDate.setDate(sunDate.getDate() + 1); //Proceed to the next date
    }
  }

  //Set the month
  let month = document.getElementById("month");
  if (month != null) 
  {
    month.innerHTML = monthNames[sunDate.getMonth()] + " " + sunDate.getFullYear();
  }
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