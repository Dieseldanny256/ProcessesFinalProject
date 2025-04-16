import { CSSProperties, useState } from 'react';
import BackGround from '../components/Images/BackGroundImg.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import PageTitle from '../components/Images/PageTitleImg.tsx';
import ResetPassword from '../components/ForgotPassword/ResetPasswordComp.tsx';
import SpeechBubble from '../components/Register/SpeechBubble.tsx';

const ForgotPasswordPage = () =>
{
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    return(
      <div>
        <BackGround>
          <div style={container}>
          <PageTitle />
          <SpeechBubble password={password} setDisabled={setDisabled} error={error} message={message}/>
          <ResetPassword disabled={disabled} password={password} setPassword={setPassword} setMessage={setMessage} setError={setError}/>
          <BuffMan />
          </div>
        </BackGround>
      </div>
    );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}

export default ForgotPasswordPage;