function LoggedInName()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    //let userId : string = ud.id;
    let firstName : string = ud.firstName;
    let lastName : string = ud.lastName;

    const doLogout = (event:any) =>
    {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

    return(
        <div id="loggedInDiv">
        <span id="userName">Logged In As {firstName} {lastName}</span><br />
        <button type="button" id="logoutButton" className="buttons" onClick={doLogout}> Log Out </button>
        </div>
    );
};

export default LoggedInName;