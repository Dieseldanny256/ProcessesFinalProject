import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

interface LoginProps
{
  setError: (error : string) => void
}

const Login: React.FC<LoginProps> = ({setError}) => {
  // Hooks
  const [loginName,setLoginName] = useState('');
  const [loginPassword,setPassword] = useState('');
  
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
              setError('Invalid credentials');
          }
          else
          {
              var user = res.userDetails;
              localStorage.setItem('user_data', JSON.stringify(user));
              setError('');
              //Check user's verification status
              if (user.isVerified) {window.location.href = '/dashboard';}
              else {window.location.href = '/verifyemail';}
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
              marginBottom: "2vh"
            }}
          /> <br/>
          <a className="link" style={{fontSize: "3vh"}} href="/forgot-password">Forgot Password?</a> 
      </div>
    </>
  );
}

export default Login;
