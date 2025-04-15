import React, { CSSProperties, useEffect, useState } from "react";
import dots from "../../assets/dots.png";
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
    showPanel: (visibility: boolean) => void,
    deletePanelVisible: boolean,
    showDeletePanel: (visibility: boolean) => void
}

const Calendar: React.FC<CalendarProps> = ({updateDate, updateIndex, panelVisible, showPanel, deletePanelVisible, showDeletePanel}) => {
  // Hi - Jacob
  // Salutations - Daniel

  const[weekOffset, setWeekOffset] = useState(0);
  const[weekExcercises, setWeekExercises] = useState<any[][]>([[], [], [], [], [], [], []]);
  const[startDate, setStartDate] = useState<Date>(getSundayOfWeek(0));
  const[tempStartDate, setTempStartDate] = useState<Date>(getSundayOfWeek(0));
  //const[loading, setLoading] = useState(false);

  const [isShown, setIsShown] = useState(false);
  const [slidePanelPosition, setSlidePanelPosition] = useState({left: 0, top: 0});

  useEffect(() => {
    const newStartDate = getSundayOfWeek(weekOffset);
    setTempStartDate(newStartDate);
  }, [weekOffset]);

  useEffect(() => {
    setStartDate(tempStartDate); // update state for rendering
  }, [weekExcercises]);

  useEffect(() => {
    fetchExercises();
  }, [tempStartDate, panelVisible, deletePanelVisible]);

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

    const dateString = getDateString(tempStartDate);

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
      <div style = {{
        left: `${slidePanelPosition.left}px`, 
        top: `${slidePanelPosition.top}px`, 
        display : "block", 
        position: "absolute", 
        overflow : "clip", 
        width : "20vw", 
        height : "20vh",
        pointerEvents : isShown ? "auto" : "none"
        }}>
        <div className = {`slidingMenu ${isShown ? 'show' : ''}`}>
          <button>Edit</button>
          <button onClick={async () => {setIsShown(false); showDeletePanel(true);}}>Delete</button>
        </div>
      </div>

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
                    
                    <div style={inline}>
                    {dayExercises.map((exercise: any, j: number) => (
                      <div key={j} className="calendarItem">
                        <div><span>{exercise.exerciseId.name}</span><br />
                        <span>Reps {exercise.reps} Sets {exercise.sets}</span></div>
                        <div><img src={dots} style={dotsStyle} 
                        onClick={(event) => {
                          if (event.currentTarget.parentElement?.parentElement == null)
                          {
                            return;
                          }
                          const rect = event.currentTarget.parentElement?.parentElement.getBoundingClientRect();
                          setSlidePanelPosition({ left: rect.right, top: rect.top });
                          updateIndex(j);
                          updateDate(getDateString(cellDate));
                          setIsShown(!isShown);}}></img></div>
                      </div>
                    ))}
                    </div>

                    <button onClick={() => handleAddClick(cellDate)}>+</button>
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

const dotsStyle: CSSProperties = {
  height: "2vh",
  padding: "4px"
}

const inline: CSSProperties = {
  display: "block",
  height: "25vh",
  overflowY: "auto",
  scrollbarWidth: "thin"
}

export default Calendar;