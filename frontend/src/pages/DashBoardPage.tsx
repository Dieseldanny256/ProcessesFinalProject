import BackGround from '../components/Images/BackGroundImg';
import NavigationBar from '../components/Dashboard/NavigationBar';
import BuffMan from '../components/Images/BuffManImg';
import DashBoard from '../components/Dashboard/DashBoard';
//import PageTitle from '../components/Images/PageTitleImg';

const DashboardPage = () =>
{
    return(
        <div>
        <BackGround>
            <NavigationBar />
            <DashBoard />
            <BuffMan />
        </BackGround>
      </div>
    );
}

export default DashboardPage;