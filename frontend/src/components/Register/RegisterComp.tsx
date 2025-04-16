import React, { useState } from 'react';

interface RegisterProps {
  disabled: boolean,
  password: string,
  setPassword: (password: string) => void,
  setError: (error: string) => void
}

const Register: React.FC<RegisterProps> = ({disabled, password, setPassword, setError}) => {
  // Hooks
  const [login, setLogin] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

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

  // Handle Register
  async function doRegister(event:any) : Promise<void>
  {
      event.preventDefault();
      var obj = {login:login,password:password,displayName:displayName,email:email};
      var js = JSON.stringify(obj);
      try
      {
          //Get the API response
          const response = await fetch(buildPath('api/register'),
          {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
          var res = JSON.parse(await response.text());

          if( res.error != "" )
          {
              setError(res.error);
          }
          else
          {
            var user = res.userDetails;
            localStorage.setItem('user_data', JSON.stringify(user));
            setError('');
            window.location.href = '/verifyemail';
          }
      }
      catch(error:any)
      {
          alert(error.toString());
          return;
      }
  };
  
  return (
    <>
      <div className="headerText2">REGISTER</div>
      <div id="loginDiv">
        <br />
          <label htmlFor="loginName" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="text"
            id="loginName"
            className='bodyText'
            placeholder="Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)} 
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              backgroundColor: "white",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="email" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="email"
            id="email"
            className='bodyText'
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              backgroundColor: "white",
              marginTop: "-1vh",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="displayName" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="text"
            id="displayName"
            className='bodyText'
            placeholder="Display Name"
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              backgroundColor: "white",
              marginTop: "-1vh",
              color: "Black"
            }}
          />
        <br />
          <label htmlFor="loginPassword" style={{ fontWeight: "bold", display: "block", marginBottom: "2vh" }}>
          </label>
          <input
            type="password"
            id="loginPassword"
            className='bodyText'
            placeholder="Password"
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(`Typing password: ${e.target.value}`);
            }}
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginBottom: "3vh",
              marginTop: "-1vh",
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
            onClick={doRegister}
            disabled={disabled}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: disabled ? " rgb(155, 155, 155)" : "#FFB202",
              color: disabled ? " #333333" : "black",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "-2vh",
              marginLeft: "-11vw",
              transition: "color 0.2s linear, background-color 0.2s linear",
              marginBottom: "2vh"
            }}
          /> 
      </div>
    </>
  );
}

export default Register;
