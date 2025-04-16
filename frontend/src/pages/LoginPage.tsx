import BackGround from '../components/Images/BackGroundImg.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import LoginContainer from '../components/LoginContainer.tsx';

const LoginPage = () =>
{
    return(
      <div>
        <BackGround>
          <LoginContainer />
          <BuffMan />
        </BackGround>
      </div>
    );
};

export default LoginPage;