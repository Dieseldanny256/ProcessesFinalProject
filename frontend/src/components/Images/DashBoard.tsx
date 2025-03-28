function LoggedInName()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    //let userId : string = ud.id;
    let displayName : string = ud.displayName

    const doLogout = (event:any) =>
    {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

    return(
        <div id="loggedInDiv">
        <span id="userName">Logged In As {displayName}</span><br />
        <button type="button" id="logoutButton" className="buttons" onClick={doLogout}> Log Out </button>
        </div>
    );
};

export default LoggedInName;