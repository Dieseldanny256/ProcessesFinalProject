import NavigationBar from '../components/Dashboard/NavigationBar';
import GreyBackground from '../components/Images/GreyBackground'; 
import DashBoard from '../components/Dashboard/DashBoard';

const DashboardPage = () =>
{
    return(
        <div>
            <div style={background}>
                <GreyBackground></GreyBackground>
            </div>
                
            <NavigationBar />
            <DashBoard />
      </div>
    );
}

const background: React.CSSProperties = {
    top: 0, 
    left: 0, 
    position: 'fixed', 
    minHeight: '100%', 
    minWidth: '100%', 
    backgroundSize: 'cover', 
    zIndex: -2
};

export default DashboardPage;