import React, { CSSProperties, useState } from "react";
import SpeechBubble from "./Register/SpeechBubble";
import LoginBox from "./Login/LoginBox";
import Login from "./Login/LoginComp";
import PageTitle from "./Images/PageTitleImg";

const LoginContainer: React.FC = () => {
  const [error, setError] = useState('');

  return (
    <div style={container}>
      <SpeechBubble password="a&7eS8dwD" setDisabled={()=>{}} error={error} message={''}/>
      <PageTitle />
      <LoginBox> 
        <Login setError={setError}/>
      </LoginBox>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}

export default LoginContainer;