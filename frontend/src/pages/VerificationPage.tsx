import BackGround from '../components/Images/BackGroundImg';
import BuffMan from '../components/Images/BuffManImg';
import PageTitle from '../components/Images/PageTitleImg';
import Verify from '../components/Verify/VerifyComp';
import VerifyBox from '../components/Verify/VerifyBox';
import { CSSProperties } from 'react';

const VerifyPage = () =>
{
    return(
        <div>
        <BackGround>
          <div style={container}>
            <PageTitle />
            <VerifyBox> 
              <Verify />
            </VerifyBox>
            <BuffMan />
          </div>
        </BackGround>
      </div>
    );
}

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}

export default VerifyPage;