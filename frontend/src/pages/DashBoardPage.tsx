import BackGround from '../components/Images/BackGroundImg';
import BuffMan from '../components/Images/BuffManImg';
import DashBoard from '../components/Images/DashBoard';
import PageTitle from '../components/Images/PageTitleImg';

const CardPage = () =>
{
    return(
        <div>
        <BackGround />
            <PageTitle />
            <DashBoard />
          <BuffMan />
      </div>
    );
}

export default CardPage;