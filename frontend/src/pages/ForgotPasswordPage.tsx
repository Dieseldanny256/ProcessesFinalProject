import { CSSProperties, useState } from 'react';
import ForgotPasswordBox from '../components/ForgotPassword/ForgotPasswordBox.tsx';
import ForgotPassword from '../components/ForgotPassword/ForgotPasswordComp.tsx';
import BackGround from '../components/Images/BackGroundImg.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import PageTitle from '../components/Images/PageTitleImg.tsx';
import SpeechBubble from '../components/Register/SpeechBubble.tsx';

const ForgotPasswordPage = () =>
{
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    return(
      <div>
        <BackGround>
          <div style={container}>
          <PageTitle />
          <SpeechBubble error={error} message={message} password={'A123456@&'} setDisabled={() => {}}/>
          <ForgotPasswordBox>
            <ForgotPassword setError={setError} setMessage={setMessage}/>
          </ForgotPasswordBox>
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