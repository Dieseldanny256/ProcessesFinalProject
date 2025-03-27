import PageTitle from '../components/Images/PageTitleImg.tsx';
import BackGround from '../components/Images/BackGroundImg.tsx';
import BuffMan from '../components/Images/BuffManImg.tsx';
import RegisterBox from '../components/Register/RegisterBox.tsx';
import Register from '../components/Register/RegisterComp.tsx';

const LoginPage = () =>
{

    return(

      <div>
        <BackGround />
          <PageTitle />
          <RegisterBox> 
            <Register />
          </RegisterBox>
          <BuffMan />
      </div>
    );
};

export default LoginPage;