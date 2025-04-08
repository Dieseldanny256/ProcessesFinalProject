import BackGround from '../components/Images/BackGroundImg';
import BuffMan from '../components/Images/BuffManImg';
import PageTitle from '../components/Images/PageTitleImg';
import Verify from '../components/Verify/VerifyComp';
import VerifyBox from '../components/Verify/VerifyBox';
import LoginContainer from '../components/LoginContainer';

const VerifyPage = () =>
{
    return(
        <div>
        <BackGround>
          <LoginContainer>
            <PageTitle />
            <VerifyBox> 
              <Verify />
            </VerifyBox>
            <BuffMan />
          </LoginContainer>
        </BackGround>
      </div>
    );
}

export default VerifyPage;