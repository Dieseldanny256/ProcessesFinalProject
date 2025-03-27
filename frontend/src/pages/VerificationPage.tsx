import BackGround from '../components/Images/BackGroundImg';
import BuffMan from '../components/Images/BuffManImg';
import PageTitle from '../components/Images/PageTitleImg';
import Verify from '../components/Verify/VerifyComp';
import VerifyBox from '../components/Verify/VerifyBox';

const CardPage = () =>
{
    return(
        <div>
        <BackGround />
          <PageTitle />
          <VerifyBox> 
            <Verify />
          </VerifyBox>
          <BuffMan />
      </div>
    );
}

export default CardPage;