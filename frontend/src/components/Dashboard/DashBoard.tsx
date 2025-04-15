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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(true);

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
            <ConfirmDelete date = {date} index = {index} panelVisible = {showDeleteConfirm} showPanel = {setShowDeleteConfirm}></ConfirmDelete>
            <EditWorkoutPanel date = {date} index = {index} panelVisible = {panelVisible} showPanel = {showPanel}/>
            <Calendar date = {date} updateDate = {(d : string) => {handleChangeDate(d)}} 
                index = {index} updateIndex = {(i : number) => {handleChangeIndex(i)}} 
                panelVisible = {panelVisible} showPanel = {handleChangeVisible}
                deletePanelVisible = {showDeleteConfirm} showDeletePanel={setShowDeleteConfirm}/>
        </div>
    );
};

export default LoggedInName;