import React, { useState } from 'react';

function Login()
{
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

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

    function handleSetLoginName( e: any ) : void
    {
        setLoginName( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
        setPassword( e.target.value );
    }

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {login:loginName,password:loginPassword};
        var js = JSON.stringify(obj);
        try
        {
            //Get the API response
            const response = await fetch(buildPath('api/login'),
            {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());

            if( res.error != "" )
            {
                setMessage(res.error);
            }
            else
            {
                var user = res.userDetails;
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };
    
    return(
        <div id="loginDiv">
        <span id="inner-title">PLEASE LOG IN TESTPUSH</span><br />
        <input type="text" id="loginName" placeholder="Username" onChange={handleSetLoginName} /><br />
        <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword} /><br />
        <input type="submit" id="loginButton" className="buttons" value = "Do It" onClick={doLogin} />
        <span id="loginResult">{message}</span>
        </div>
    );
};

export default Login;