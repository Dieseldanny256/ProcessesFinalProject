import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  // Hooks
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

  // Handle Login
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
              setMessage('Invalid credentials');
          }
          else
          {
              var user = res.userDetails;
              localStorage.setItem('user_data', JSON.stringify(user));
              setMessage('');
              window.location.href = '/dashboard';
          }
      }
      catch(error:any)
      {
          alert(error.toString());
          return;
      }
  };
      
  function handleSetLoginName( e: any ) : void
  {
    setLoginName( e.target.value );
  }

  function handleSetPassword( e: any ) : void
  {
    setPassword( e.target.value );
  }

  return (
    <>
      <div className="headerText">LOGIN</div>

      <div id="loginDiv">
        <br />
          <input
            type="text"
            id="userName"
            className='bodyText'
            placeholder="Login"
            onChange={handleSetLoginName}
            required

            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "1vh",
              backgroundColor: "white",
              color: "Black"
            }}
          />
          
        <br />
          <input
            type="password"
            id="loginPassword"
            className='bodyText'
            placeholder="Password"
            onChange={handleSetPassword}
            required

            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "1vh",
              marginBottom: "1vh",
              backgroundColor: "white",
              color: "Black"
            }}
          />
          
        <br />
          <input
            type="submit"
            id="loginButton"
            className="button"
            value="SUBMIT"
            onClick={doLogin}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "1vh",
              marginLeft: "-11vw",
            }}
          /> 

          <span
            id="loginResult"
            style={{
              display: "block",
              marginTop: "10px",
              fontWeight: "bold",
              color: "red"
            }}
          >
            {message}
          </span>
      </div>
    </>
  );
}

export default Login;
