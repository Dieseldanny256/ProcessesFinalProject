import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const Verify: React.FC = () => {
  //const navigate = useNavigate();

  // Hooks
  const [verificationCode, setVerificationCode] = useState('');
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

  let _ud : any = localStorage.getItem('user_data');
  let userId = null;
  if (_ud)
  {
    let ud = JSON.parse( _ud );
    userId = ud.userId;
  }

  const doVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    var obj = {userId:userId,verificationCode:verificationCode};
    var js = JSON.stringify(obj);
    try
    {
        //Get the API response
        const response = await fetch(buildPath('api/verifyEmail'),
        {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
        var res = JSON.parse(await response.text());

        if( res.error != "" )
        {
            setMessage(res.error);
        }
        else
        {
            window.location.href = '/dashboard';
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
      <div className="headerText2">VERIFY</div>
      <div id="verifyDiv">
        <br />
          <input
            type="text"
            id="verifyCode"
            className='bodyText'
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={{
              width: "60%",
              padding: "1.5vh",
              border: ".5vh solid Black",
              borderRadius: "2px",
              marginLeft: "-10vw",
              marginTop: "3vw",
              backgroundColor: "white",
              color: "Black",
            }}
          />
        <br />
          <input
            type="submit"
            id="loginButton"
            className="button"
            value="SUBMIT"
            onClick={doVerify}
            style={{
              width: "50%",
              padding: "2vh",
              backgroundColor: "#FFB202",
              border: ".7vh solid Black",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: "2vh",
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

export default Verify;
