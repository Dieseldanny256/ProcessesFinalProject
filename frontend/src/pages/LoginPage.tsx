import PageTitle from '../components/Images/PageTitleImg.tsx';
import Login from '../components/Login/LoginComp.tsx';
import BackGround from '../components/Images/BackGroundImg.tsx';
import LoginBox from '../components/Login/LoginBox.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';

const LoginPage = () =>
{

    return(

      <div>
        <BackGround />
          <PageTitle />
          <LoginBox> 
            <Login />
          </LoginBox>
          <BuffMan />
      </div>
    );
};

export default LoginPage;