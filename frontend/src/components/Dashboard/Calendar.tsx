import React, { CSSProperties, useEffect, useState } from "react";
import dots from "../../assets/dots.png";
import flame from "../../assets/flame.gif";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const app_name = 'powerleveling.xyz';

function buildPath(route: string): string {
  return process.env.NODE_ENV !== 'development'
    ? `http://${app_name}:5000/${route}`
    : `http://localhost:5000/${route}`;
}

function getDateString(date: Date) {
  let string = date.getFullYear() + "-";
  let month = (date.getMonth() + 1).toString();
  if (month.length < 2) { month = "0" + month; }
  let day = (date.getDate()).toString();
  if (day.length < 2) { day = "0" + day; }
  string = string + month + "-" + day;
  return string;
}

function getSundayOfWeek(offset = 0) {
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
    setExerciseType: (exercise: {exerciseId : {_id:number, name:string, category:string, __v:number}, sets:number, reps:number, _id:number }) => void
}

interface Exercise {
  exerciseId: {
    _id: number;
    name: string;
    category: string;
    __v: number;
  };
  sets: number;
  reps: number;
  _id: number;
}

interface ExerciseDayData {
  exercises: Exercise[],
  isChecked: boolean
}

const Calendar: React.FC<CalendarProps> = ({updateDate, updateIndex, panelVisible, showPanel, deletePanelVisible, showDeletePanel, setExerciseType}) => {
  // Hi - Jacob
  // Salutations - Daniel

  const[weekOffset, setWeekOffset] = useState(0);
  const[weekExcercises, setWeekExercises] = useState<ExerciseDayData[]>(
    [{exercises: [], isChecked: false},
     {exercises: [], isChecked: false},
     {exercises: [], isChecked: false},
     {exercises: [], isChecked: false},
     {exercises: [], isChecked: false},
     {exercises: [], isChecked: false},
     {exercises: [], isChecked: false}]);
  const[startDate, setStartDate] = useState<Date>(getSundayOfWeek(0));
  const[tempStartDate, setTempStartDate] = useState<Date>(getSundayOfWeek(0));
  //const[loading, setLoading] = useState(false);

  const [isShown, setIsShown] = useState(false);
  const [slidePanelPosition, setSlidePanelPosition] = useState({ left: 0, top: 0 });

  const [hoveredButton, setHoveredButton] = useState<"left" | "right" | null>(null);
  
  const [streak, setStreak] = useState<number>(0);
  
  // get profile for streak
  const _ud = localStorage.getItem('user_data');
  if (!_ud) {console.error('No user data found'); return;}
  const userData = JSON.parse(_ud);

  let userId = '';
  userId = userData.userId;

  useEffect(() => {
      async function getProfile(): Promise<void> {
        let obj = { userId: Number(userId) };
        let js = JSON.stringify(obj);
  
        const response = await fetch(buildPath('api/getProfile'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' },
        });
  
        let txt = await response.text();
        let res = JSON.parse(txt);
        
        setStreak(res.profile.streak);
      }
  
      getProfile();
    }, [userId]);

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
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    const dateString = getDateString(tempStartDate);

    try {
      const response = await fetch(buildPath(`api/workouts/${userId}/${dateString}/weekExercises`));
      const data = await response.json();
      setWeekExercises(data.exercises || 
        [{exercises: [], isChecked: false}, 
         {exercises: [], isChecked: false}, 
         {exercises: [], isChecked: false}, 
         {exercises: [], isChecked: false}, 
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false}]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch exercises.");
    }
  };

  const checkOff = async () => {
    const _userData = localStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    const dateString = getDateString(new Date());
    console.log(dateString);

    try {
      const response = await fetch(buildPath(`api/workouts/${userId}/${dateString}/checkoff`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log(data?.updatedStats)
      if (data?.error) {alert(data.error);}
    } catch (err) {
      console.error(err);
      alert("Failed to checkoff.");
    }
  };

  const handleAddClick = (date: Date) => {
    updateDate(getDateString(date));
    updateIndex(-1);
    showPanel(true);
    setIsShown(false);
    setExerciseType({exerciseId: {_id:-1, name: "Select Workout", category: "", __v: -1}, sets: 0, reps: 0, _id: -1 });
  };

  const compareDates = (date1: Date, date2: Date) => {
    if (date1.getFullYear() < date2.getFullYear()) {
      return -1;
    } else if (date1.getFullYear() > date2.getFullYear()) {
      return 1;
    }
    if (date1.getMonth() < date2.getMonth()) {
      return -1;
    } else if (date1.getMonth() > date2.getMonth()) {
      return 1;
    }
    if (date1.getDate() < date2.getDate()) {
      return -1;
    } else if (date1.getDate() > date2.getDate()) {
      return 1;
    }
    return 0;
  };

  const getButtonStyle = (side: "left" | "right"): CSSProperties => ({
    transformOrigin: "center",
    fontFamily: 'microgramma-extended, sans-serif',
    marginTop: "2vh",
    marginLeft: side == "right" ? "3vw" : "0vw",
    marginRight: side == "left" ? "3vw" : "0vw",
    fontSize: "5vw",
    padding: "1vh",
    textAlign: "center",
    cursor: "pointer",
    color: "rgb(255, 255, 255)",
    background: "none",
    outline: "none",
    border: "none",
    transform: hoveredButton === side ? "scale(1.15) rotate(2deg)" : "scale(1.0)",
    transition: "transform 0.2s ease-in-out, filter 0.2s ease",
    filter: hoveredButton === side ? "drop-shadow(0 0 5px #ffb202)" : "none",
  });

  return (
    <div style={outerContainer}>
      <div
        style={{
          left: `${slidePanelPosition.left}px`,
          top: `${slidePanelPosition.top}px`,
          display: "block",
          position: "absolute",
          overflow: "clip",
          width: "20vw",
          height: "20vh",
          pointerEvents: isShown ? "auto" : "none",
        }}
      >
        <div className={`slidingMenu ${isShown ? "show" : ""}`}>
          <button
            onClick={async () => {
              setIsShown(false);
              showPanel(true);
            }}
            className="menuButton"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              setIsShown(false);
              showDeletePanel(true);
            }}
            className="menuButton"
          >
            Delete
          </button>
        </div>
      </div>

      <h1 style={month}>{monthNames[startDate.getMonth()]} {startDate.getFullYear()}</h1>
      <div style={{ ...container, overflow: "visible" }}>
        <button
          style={getButtonStyle("left")}
          onClick={() => setWeekOffset((prev) => prev - 1)}
          onMouseEnter={() => setHoveredButton("left")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          &lt;
        </button>

        <table style={table}>
          <thead>
            <tr>
              {dayNames.map((day, i) => {
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + i);

                const isToday = compareDates(new Date(), cellDate) === 0;
                const dayChecked = weekExcercises[i]?.isChecked;

                return (
                <th key={i} style={headerCellStyle}>
                  <span>{day}</span>
                  {isToday && (
                    <div className="checkbox-wrapper" style={{display: "inline-block", float: "right"}}>
                    <input className="inp-cbx" id="cbx" onChange={async () => {
                      const updated = [...weekExcercises];
                      updated[i] = {
                        ...updated[i],
                        isChecked: !updated[i].isChecked
                      };
                      setWeekExercises(updated);
        
                      await checkOff(); // also call your backend update
                    }} checked = {dayChecked} type="checkbox"/>
                      <label className="cbx" htmlFor="cbx"><span>
                        <svg width="1.2vw" height="1.2vw" viewBox="0 0 12 12">
                          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </svg></span>
                      </label></div>)}
                </th>
              )})}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekExcercises.map((dayExercises, i) => {
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + i);

                const hasPassed = compareDates(new Date(), cellDate) > 0;
                const isToday = compareDates(new Date(), cellDate) === 0;

                const cellStyle: React.CSSProperties = {
                  backgroundColor: dayExercises.isChecked && hasPassed
                    ? "rgb(165, 113, 0)"
                    : isToday
                    ? "rgb(255, 253, 207)"
                    : hasPassed
                    ? "rgb(155, 155, 155)"
                    : "white",
                  color: hasPassed ? "rgb(57, 51, 51)" : "black",
                  padding: "10px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, border 0.3s ease",
                  border: isToday ? "3px solid #FFB202" : "1px solid black",
                };
                
                const calendarItemStyle: React.CSSProperties = {
                  backgroundColor: dayExercises.isChecked ? "rgb(255, 253, 207)" : " #e2e2e2",
                  color: dayExercises.isChecked ? "rgb(94, 68, 6)" : " #222222",
                  border: dayExercises.isChecked ? "2px solid #FFB202" : "2px solid #333333",
                };

                return (
                  <td key={i} className="calendarCell" style={cellStyle}>
                    {isToday && (
                      <div style={flameHolder}>
                        {streak > 0 && (
                          <img src={flame} alt="Flame" style={flameGifStyle} />
                        )}
                        {streak > 0 && (
                          <span style={streakNumberStyle}>{streak}</span>
                        )}
                        
                      </div>
                    )}
                    <div>
                      <strong>{monthAbbreviations[cellDate.getMonth()]} {cellDate.getDate()}</strong>
                    </div>

                    <div style={inline}>
                      {dayExercises.exercises.map((exercise: any, j: number) => (
                        <div key={j} className="calendarItem" style={calendarItemStyle}>
                          <div>
                            <span>{exercise.exerciseId.name} {exercise.reps}x{exercise.sets}</span><br />
                          </div>
                          {(!hasPassed && !dayExercises.isChecked) && <div>
                            <img
                              src={dots}
                              style={dotsStyle}
                              onClick={(event) => {
                                const rect = event.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                                setSlidePanelPosition({ left: rect!.right, top: rect!.top });
                                updateIndex(j);
                                updateDate(getDateString(cellDate));
                                setIsShown(!isShown);
                                setExerciseType(exercise);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.2)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1.0)";
                              }}
                            />
                          </div>}
                        </div>
                      ))}
                    </div>

                    {(!hasPassed && !dayExercises.isChecked) && <button onClick={() => handleAddClick(cellDate)}>+</button>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>

        <button
          style={getButtonStyle("right")}
          onClick={() => setWeekOffset((prev) => prev + 1)}
          onMouseEnter={() => setHoveredButton("right")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

const outerContainer: CSSProperties = {
  display: "block",
  alignItems: "center",
  userSelect: 'none',
};

const container: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  width: "100%",
  height: "100%"
};

const table: CSSProperties = {
  backgroundColor: "rgb(0, 0, 0)",
  width: "80vw",
  height: "25vh",
  tableLayout: "fixed",
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
};

const headerCellStyle: CSSProperties = {
  backgroundColor: "#BA0000",
  color: "white",
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  border: '1px solid black'
};

const month: CSSProperties = {
  color: "rgb(214, 214, 214)",
  fontFamily: "microgramma-extended, sans-serif",
  marginTop: '0%',
  fontWeight: "700",
  fontStyle: "normal",
  fontSize: "3vw",
  zIndex: 20,
  position: 'relative',
  textShadow: '3px 3px 3px black',
};

const dotsStyle: CSSProperties = {
  height: "1.7vw",
  minHeight: "12px",
  maxHeight: "22px",
  cursor: "pointer",
  transition: "transform 0.2s ease, filter 0.2s ease",
  zIndex: -1,
};


const inline: CSSProperties = {
  display: "block",
  height: "25vh",
  overflowY: "auto",
  scrollbarWidth: "thin",
};

const flameHolder: React.CSSProperties = {
  position: 'relative',
  bottom: '12%',
  right: '50%',
};

const flameGifStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '0%',
  left: '47%',
  width: '150px',
  transform: 'translateX(-50%)',
  height: '150px',
};

const streakNumberStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  transform: 'translateX(-50%)',
  fontSize: '20px',
  fontWeight: 'bold',
  color: 'white',
  textShadow: `
  -2px -2px 0 black,
   2px -2px 0 black,
  -2px  2px 0 black,
   2px  2px 0 black,
  -2px  0px 0 black,
   2px  0px 0 black,
   0px -2px 0 black,
   0px  2px 0 black
`,
  zIndex: 3,
};


export default Calendar;
