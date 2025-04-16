import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

interface LoginProps
{
  setError: (error : string) => void
  setMessage: (message : string) => void
}

const ForgotPassword: React.FC<LoginProps> = ({setError, setMessage}) => {
  // Hooks
  const [loginName,setLoginName] = useState('');
  const [email,setEmail] = useState('');
  
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

  function buildSitePath(route:string) : string
  {
    if (process.env.NODE_ENV != 'development')
    {
    return 'http://' + app_name + '/' + route;
    }
    else
    {
    return 'http://localhost:5173/' + route;
    }
  }

  // Handle Login
  async function sendResetLink(event:any) : Promise<void>
  {
      event.preventDefault();
      var obj = {login:loginName, email:email, path:buildSitePath('')};
      var js = JSON.stringify(obj);
      try
      {
          //Get the API response
          const response = await fetch(buildPath('api/sendResetLink'),
          {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
          var res = JSON.parse(await response.text());

          if( res.error != "" )
          {
              setError('There was no account found with those credentials!');
          }
          else
          {
              setError('');
              setMessage('Message sent, bro! When you get it, click the link!');
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

  function handleSetEmail( e: any ) : void
  {
    setEmail( e.target.value );
  }

  return (
    <>
      <div className="headerText" style={{fontSize: "3vw", marginLeft: "-10vw"}}>FORGOT<br/>PASSWORD?</div>

      <div id="loginDiv">
        <br />
          <input
            type="text"
            id="userName"
            className='bodyText'
            placeholder="Username"
            autoComplete='false'
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
            type="email"
            id="loginPassword"
            className='bodyText'
            placeholder="Email"
            autoComplete='false'
            onChange={handleSetEmail}
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
            value="RESET"
            onClick={sendResetLink}
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
          /> 
      </div>
    </>
  );
}

export default ForgotPassword;
