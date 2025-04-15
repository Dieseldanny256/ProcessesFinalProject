import EditWorkoutPanel from "./EditWorkoutPanel";
import Calendar from "./Calendar";
import { useState } from "react";
import ConfirmDelete from "./ConfirmDelete";

function LoggedInName()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let displayName : string = ud.displayName

    const [date, setDate] = useState('');
    const [index, setIndex] = useState(0);
    const [panelVisible, showPanel] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [exerciseType, setExerciseType] = useState({exerciseId: {_id:-1, name: "Select Workout", category: "", __v: -1}, sets: 0, reps: 0, _id: -1 });

    function handleChangeDate(d : string) {
        setDate(d);
    }

    function handleChangeIndex(i : number) {
        setIndex(i);
    }

    function handleChangeVisible(b : boolean)
    {
        showPanel(b);
    }

    return(
        <div>
            <div id="loggedInDiv">
            <span id="userName">Logged In As {displayName}</span><br />
            </div>
            <ConfirmDelete date = {date} index = {index} panelVisible = {showDeleteConfirm} showPanel = {setShowDeleteConfirm}></ConfirmDelete>
            <EditWorkoutPanel date = {date} index = {index} panelVisible = {panelVisible} 
                showPanel = {showPanel} exerciseType = {exerciseType} setExerciseType = {setExerciseType}/>
            <Calendar date = {date} updateDate = {(d : string) => {handleChangeDate(d)}} 
                index = {index} updateIndex = {(i : number) => {handleChangeIndex(i)}} 
                panelVisible = {panelVisible} showPanel = {handleChangeVisible}
                deletePanelVisible = {showDeleteConfirm} showDeletePanel={setShowDeleteConfirm}
                setExerciseType = {setExerciseType}/>
        </div>
    );
};

export default LoggedInName;