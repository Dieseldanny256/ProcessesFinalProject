function LoggedInName()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let displayName : string = ud.displayName

    return(
        <div id="loggedInDiv">
            <span id="userName">Logged In As {displayName}</span><br />
        </div>
    );
};

export default LoggedInName;