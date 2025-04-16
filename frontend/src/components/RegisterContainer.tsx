import React, { CSSProperties, useState } from "react";
import SpeechBubble from "./Register/SpeechBubble";
import RegisterBox from "./Register/RegisterBox";
import Register from "./Register/RegisterComp";
import PageTitle from "./Images/PageTitleImg";
import BuffMan from "./Images/BuffManImg";

const RegisterContainer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');

  return (
    <div style={container}>
        <SpeechBubble password={password} setDisabled={setDisabled} error={error} message={''}/>
        <PageTitle />
        <BuffMan />
        <RegisterBox> 
            <Register disabled={disabled} password={password} setPassword={setPassword} setError={setError}/>
        </RegisterBox>
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}

export default RegisterContainer;