import PageTitle from '../components/Images/PageTitleImg.tsx';
import BackGround from '../components/Images/BackGroundImg.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import RegisterBox from '../components/Register/RegisterBox.tsx';
import Register from '../components/Register/RegisterComp.tsx';
import LoginContainer from '../components/LoginContainer.tsx';

const LoginPage = () =>
{
    return(

      <div>
        <BackGround>
          <LoginContainer>
            <PageTitle />
            <RegisterBox> 
              <Register />
            </RegisterBox>
            <BuffMan />
          </LoginContainer>
        </BackGround>
      </div>
    );
};

export default LoginPage;