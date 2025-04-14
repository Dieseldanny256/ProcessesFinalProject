import React, { CSSProperties, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

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

function getSundayOfWeek(offset = 0)
{
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay() + offset * 7);
  return sunday;
}

interface CalendarProps
{
    date : string,
    updateDate: (dateStr: string) => void,
    index : number,
    updateIndex: (index: number) => void,
    panelVisible: boolean,
    showPanel: (visibility: boolean) => void
}

const Calendar: React.FC<CalendarProps> = ({date, updateDate, index, updateIndex, panelVisible, showPanel}) => {
  // Hi - Jacob
  // Salutations - Daniel
  // Greetings - Stephen
  const[weekOffset, setWeekOffset] = useState(0);
  const[weekExcercises, setWeekExercises] = useState<any[][]>([[], [], [], [], [], [], []]);
  const[startDate, setStartDate] = useState<Date>(getSundayOfWeek(0));
  //const[loading, setLoading] = useState(false);

  useEffect(() => {
    setStartDate(getSundayOfWeek(weekOffset));
  }, [weekOffset]);

  useEffect(() => {
    const fetchExercises = async () => {
      //setLoading(true);
      const _userData = localStorage.getItem("user_data");
      if (!_userData) {
        alert("User not logged in.");
        //setLoading(false);
        return;
      }
      const userData = JSON.parse( _userData );
      const userId = userData.userId;

      const dateString = getDateString(startDate);

      try {
        const response = await fetch(buildPath(`api/workouts/${userId}/${dateString}/weekExercises`));
        const data = await response.json();
        setWeekExercises(data.exercises || [[], [], [], [], [], [], []]);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch exercises.");
      }

      //setLoading(false);
    };

    fetchExercises();
  }, [startDate, panelVisible]);

  const handleAddClick = (date: Date) => {
    updateDate(getDateString(date));
    updateIndex(-1);
    showPanel(true);
  };

  const compareDates = (date1 : Date, date2 : Date) =>
  {
    if (date1.getFullYear() < date2.getFullYear())
    {
      return -1;
    }
    else if (date1.getFullYear() > date2.getFullYear())
    {
      return 1;
    }
    
    //Same year
    if (date1.getMonth() < date2.getMonth())
    {
      return -1;
    }
    else if (date1.getMonth() > date2.getMonth())
    {
      return 1;
    }

    //Same year and month
    if (date1.getDate() < date2.getDate())
    {
      return -1;
    }
    else if (date1.getDate() > date2.getDate())
    {
      return 1;
    }
    return 0;
  }

  return (
    <div style = {outerContainer}>
      <h1 style = {month}>{monthNames[startDate.getMonth()]} {startDate.getFullYear()}</h1>
      <div style = {container}>
        <button className="button" style={button} onClick={() => setWeekOffset(prev => prev - 1)}>&lt;</button>
        <table style = {table}>
          <tbody><tr>
              {weekExcercises.map((dayExercises, i) => {
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + i);

                //const isToday = compareDates(new Date(), cellDate) === 0;
                const hasPassed = compareDates(new Date(), cellDate) > 0;
                //const isSelected = date === getDateString(cellDate);

                const cellStyle: React.CSSProperties = {
                  border: compareDates(new Date(), cellDate) === 0 ? "5px solid #FFB202" : "2px solid black",
                  backgroundColor: hasPassed ? "rgb(180, 168, 168)" : "white",
                  color: hasPassed ? "rgb(57, 51, 51)" : "black",
                  padding: "10px",
                  textAlign: "center"
                };

                return (
                  <td key={i} className = "calendarCell" style = {cellStyle}>
                    <div>
                      <strong>{dayNames[i]}</strong><br />
                      <span>{monthAbbreviations[cellDate.getMonth()]} {cellDate.getDate()}</span>
                    </div>

                    <button onClick={() => handleAddClick(cellDate)}>+</button>

                    {dayExercises.slice(0, 3).map((exercise: any, j: number) => (
                      <div key={j} className="calendarItem">
                        <span>{exercise.exerciseId.name}</span><br />
                        <span>{exercise.reps} {exercise.sets}</span>
                      </div>
                    ))}
                  </td>
                );
              })}
          </tr></tbody>
        </table>
        <button className="button" style={button} onClick={() => setWeekOffset(prev => prev + 1)}>&gt;</button>
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

export default Calendar;