import React, { useState } from 'react';

const Register: React.FC = () => {
  // Hooks
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
              setMessage(res.error);
          }
          else
          {
            var user = res.userDetails;
            localStorage.setItem('user_data', JSON.stringify(user));
            setMessage('');
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
            onChange={(e) => setPassword(e.target.value)} 
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
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "-2vh",
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

export default Register;
