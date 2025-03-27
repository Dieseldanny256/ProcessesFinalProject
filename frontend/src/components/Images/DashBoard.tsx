import { useNavigate } from "react-router-dom";

function LoggedInName()
{

    // var user={}

    const navigate = useNavigate();

    function doLogout(event:any) : void
    {
	    event.preventDefault();
        alert('doLogout');
        navigate("/login");
    };    

    return(
      <div id="loggedInDiv">
        <span id="userName">Logged In As John Doe </span><br />
        <button type="button" id="logoutButton" className="buttons" 
           onClick={doLogout}> Log Out </button>
      </div>
    );
};

export default LoggedInName;