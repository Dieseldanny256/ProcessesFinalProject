import React, { CSSProperties } from "react";
import { useParams } from "react-router-dom";

interface ResetPasswordProps
{
  disabled: boolean,
  password: string,
  setPassword: (password: string) => void,
  setError: (error: string) => void,
  setMessage: (message: string) => void
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ disabled, password, setPassword, setError, setMessage }) => {
  const {userId, token} = useParams();

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
  async function resetPassword(event:any) : Promise<void>
  {
      event.preventDefault();
      var obj = {password: password};
      var js = JSON.stringify(obj);
      try
      {
          //Get the API response
          const response = await fetch(buildPath(`api/resetPassword/${userId}/${token}`),
          {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
          var res = JSON.parse(await response.text());

          if( res.error != "" )
          {
              setError('There was an issue validating your request. You might wanna get another link, bro.');
          }
          else
          {
              setError('');
              setMessage('Password reset, bro! Click <a class="link" href="/">here</a> to return to login!');
          }
      }
      catch(error:any)
      {
          alert(error.toString());
          return;
      }
  };

  return (
    <div style={container}>
      <div style={outLine}>
        <div style={BoxStyle}>
          <div className="headerText" style={{fontSize: "3vw", marginLeft: "-10vw"}}>RESET<br/>PASSWORD</div>
          <div id="loginDiv">
            <br />
              <input
                type="password"
                id="loginPassword"
                className='bodyText'
                placeholder="New Password"
                autoComplete='false'
                onChange={(e)=>{setPassword(e.target.value)}}
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
                disabled={disabled}
                onClick={resetPassword}
                style={{
                  width: "50%",
                  padding: "2vh",
                  backgroundColor: disabled ? " rgb(155, 155, 155)" : "#FFB202",
                  color: disabled ? " #333333" : "black",
                  border: ".7vh solid Black",
                  borderRadius: "2px",
                  cursor: "pointer",
                  marginLeft: "-11vw",
                  transition: "color 0.2s linear, background-color 0.2s linear",
                  marginBottom: "2vh"
                }}
              /> 
          </div>
        </div>
      </div>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transform: "translateX(10%)",
  }

const outLine: CSSProperties = {
    backgroundColor: "black",
    padding: "1vh",
    display: "flex",
    minHeight: "10vh",
    clipPath: "polygon(0 0, 100% 0%, 70% 100%, 0% 100%)",
    flexDirection: "column",
  }

const BoxStyle: CSSProperties = {
    backgroundColor: "white",
    padding: "0vh",
    width: "45vw",
    position: "relative",
    clipPath: "polygon(0 0, 99.2% 0%, 69.5% 100%, 0% 100%)",
  }

export default ResetPassword;
