import PageTitle from '../components/Images/PageTitleImg.tsx';
import Login from '../components/Login/LoginComp.tsx';
import BackGround from '../components/Images/BackGroundImg.tsx';
import LoginBox from '../components/Login/LoginBox.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import LoginContainer from '../components/LoginContainer.tsx';

const LoginPage = () =>
{

    return(
      <div>
        <BackGround>
          <LoginContainer>
            <PageTitle />
            <LoginBox> 
              <Login />
            </LoginBox>
          </LoginContainer>
          <BuffMan />
        </BackGround>
      </div>
    );
};

export default LoginPage;