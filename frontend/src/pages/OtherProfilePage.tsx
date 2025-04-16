import React, { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import GreyBackground from '../components/Images/GreyBackground.tsx'; 
import logoImage from '../assets/logo.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import flameGif from '../assets/flame.gif';

import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';
import profile5 from '../assets/profile5.png';
import profile6 from '../assets/profile6.png';
import profile7 from '../assets/TheHolyOne.png';

const app_name = 'powerleveling.xyz';

function buildPath(route:string) : string
{
  if (process.env.NODE_ENV != 'development')
  {
  return 'http://' + app_name + ':5000/' + route;
  }
  else
  {
  return 'http://localhost:5000/' + route;
  }
}

// make the chart work
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadarController,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadarController,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  Filler
);

const OtherProfilePage: React.FC = () => {
  const profilePictures = [profile1, profile2, profile3, profile4, profile5, profile6, profile7];
  const [powerLevel, setPowerLevel] = useState(0);
  const [profilePicture, setProfilePicture] = useState<number>(0);
  const [stats, setStats] = useState(0);
  const [displayName, setDisplay] = useState<string>('');
  const [friends, setFriends] = useState<{profilePicture: number; displayName: string; profileImage: string; powerlevel: number; userId: number}[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    async function getProfile(): Promise<void> {
      let obj = { userId: Number(userId) };
      let js = JSON.stringify(obj);

      const response = await fetch(buildPath('api/getProfile'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let txt = await response.text();
      let res = JSON.parse(txt);
      
      setProfilePicture(res.profile.profilePicture);
      setDisplay(res.profile.displayName);
      setStats(res.profile.stats);
      setPowerLevel(res.profile.powerlevel);
      setStreak(res.profile.streak);
    }

    getProfile();
  }, [userId]);

  useEffect(() => {
    async function searchFriends(): Promise<void> {
      let obj = { userId: Number(userId) };
      let js = JSON.stringify(obj);

      const response = await fetch(buildPath('api/searchFriends'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let txt = await response.text();
      let res = JSON.parse(txt);

      setFriends(res.friendResults);
      setLoadingFriends(false);
    }

    searchFriends();
  }, [userId]);

  const radarData = {
    labels: ['Chest', 'Back', 'Legs', 'Stamina', 'Core', 'Arms'],
    datasets: [
      {
        data: stats,
        backgroundColor: 'rgba(255, 255, 0, 0.8)', 
        borderColor: 'rgb(0, 0, 0)',
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderColor: 'rgb(0, 0, 0)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 255, 0)',
        pointRadius: 3,
        fill: true, 
      },
    ],
  };

  const config = {
    type: 'radar',
    data: radarData,
    options: {
      scales: {
        r: {
          angleLines: {
            lineWidth: 2,
            color: 'rgba(0, 0, 0, 0.45)',
          },
          suggestedMin: 0,
          suggestedMax: 100,
          grid: {
            lineWidth: 2,
            color: 'rgba(0, 0, 0, 0.45)',
          },
          ticks: {
            display: false,
          },
          beginAtZero: true,
        },
      },
      elements: {
        line: {
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      pointLabels: {
        font: {
          family: 'microgramma-extended, sans-serif',
          size: 25,
          weight: 'normal',
        },
        color: 'rgb(0, 0, 0)',
      },
    },
  };

  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <header style={header}>
        <div
          style={{...leftHeader, cursor: 'pointer'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => handleBackClick()}
        >
          <div style={backArrowStyle}>&lt;</div>
        </div>
        <div style={centerHeader}>
          {displayName}
        </div>
        <img src={logoImage} alt="logo" style={logo} />
        <div style={powerLevelTextStyle}>Power Level: {powerLevel}</div>
      </header>

      <GreyBackground />

      <div style={leftSection}>
        <div style={profileImageWrapper}>
          <img src={profilePictures[profilePicture]} alt="Profile" style={profileImageStyle} />
          {streak > 0 && (
            <img src={flameGif} alt="Flame" style={flameGifStyle} />
          )}
          {streak >= 0 && (
            <span style={streakNumberStyle}>{streak}</span>
          )}
        </div>
        <div style={hexagonWrapper}>
          <div style={blackOutline}></div>
          <div style={labelBackground}></div>
          <div style={hexagonBackground}></div>
          <Radar ref={chartRef} data={radarData} options={config.options} />
        </div>
      </div>

      <div style={verticalDivider}></div>

      <div style={rightSection}>
        <div style={friendHeader}>
          <h1>Friends</h1>
        </div>

        <div style={friendListContainer}>
          <div style={friendList}>
            {loadingFriends ? (
              <div>Loading Friends...</div>
            ) : Array.isArray(friends) && friends.length > 0 ? (
              friends.map((friend, index) => (
                <Link 
                  to={`/profile/${friend.userId}`}
                  key={index}
                  style={{
                    ...friendItem,
                    backgroundColor: hoveredIndex === index ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)',
                    transform: hoveredIndex === index ? 'scale(1.01)' : 'scale(1)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div style={friendImageWrapper}>
                    <img 
                      src={profilePictures[friend.profilePicture] || profilePictures[0]} 
                      alt="Friend" 
                      style={friendProfileImageStyle} 
                    />
                  </div>
                  <div style={friendNameWrapper}>
                    <span style={friendNameStyle}>{friend.displayName}</span>
                    <span style={friendPowerLevelStyle}>{friend.powerlevel}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div style={noFriendsStyle}>No friends yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const profileImageWrapper: React.CSSProperties = {
  position: 'relative',
  width: '30vh',
  height: '30vh',
  margin: '0 auto',
};

const flameGifStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-62%',
  right: '-42%',
  width: '30vh',
  height: '20vh',
  zIndex: 2,
};

const streakNumberStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-15%',
  left: '92%',
  transform: 'translateX(-50%)',
  fontSize: '3vh',
  fontWeight: 'bold',
  color: 'white',
  textShadow: `
    -2px -2px 0 black,
      2px -2px 0 black,
    -2px  2px 0 black,
      2px  2px 0 black,
    -2px  0px 0 black,
      2px  0px 0 black,
      0px -2px 0 black,
      0px  2px 0 black
  `,
  zIndex: 3,
};


// right section aka friend area
const rightSection: React.CSSProperties = {
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontSize: '20px',
  fontFamily: 'microgramma-extended, sans-serif',
  position: 'fixed',
  height: '100%',
  top: '18%',
  width: '66.66%',
  left: '33.33%',
  overflowY: 'auto',
  zIndex: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '20px',
  userSelect: 'none',
};

const friendItem: React.CSSProperties = {
  backgroundColor: 'rgb(255, 255, 255)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  fontSize: '20px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '10px',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
};

const friendNameWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const friendNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

const friendPowerLevelStyle: React.CSSProperties = {
  color: '#666',
  marginLeft: 'auto',
};

const friendHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '85%',
  fontSize: '16px',
  color: '#000',
  height: '10%',
};

const friendListContainer: React.CSSProperties = {
  height: '600px',
  width: '85%',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  borderRadius: '8px',
};

const friendList: React.CSSProperties = {
  paddingLeft: '1.8%',
  color: 'black',
  marginTop: '20px',
  width: '96%',
};

const friendImageWrapper: React.CSSProperties = {
  width: '5vh',
  height: '4.2vh',
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: '15px',
};

const friendProfileImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const noFriendsStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#666',
  textAlign: 'center',
  marginTop: '30px',
};

const powerLevelTextStyle: React.CSSProperties = {
  position: 'absolute',
  top: '70%',  
  left: '8.6%',
  fontFamily: '"microgramma-extended", sans-serif',
  fontSize: '3vh',
  color: 'rgb(230, 230, 230)',
};

// left area with picture and chart
const leftSection: React.CSSProperties = {
  color: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'microgramma-extended, sans-serif',
  width: '33.33%',
  height: '100%',
  position: 'fixed',
  left: 0,
  top: '30%',
  userSelect: 'none',
};

const profileImageStyle: React.CSSProperties = {
  width: '30vh',
  height: '30vh',
  position: 'absolute',
  borderRadius: '50%',
  objectFit: 'cover',
  top: '-18%',
  margin: '0 auto',
  border: '6px solid black',
  left: '50%',
  transform: 'translateX(-50%)', 
};

// chart
const hexagonWrapper: React.CSSProperties = {
  position: 'relative',
  top: '5%',
  width: '28vh',
  height: '32vh',
  left: '50%',
  transform: 'translateX(-50%)', 
};

const hexagonBackground: React.CSSProperties = {
  position: 'absolute',
  width: '74%',
  height: '72%',
  backgroundColor: 'rgb(209, 209, 209)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  left: '50.5%',
  top: '43%',
  transform: 'translate(-50%, -50%)', 
  zIndex: -1,
};

const labelBackground: React.CSSProperties = {
  position: 'absolute',
  width: '110%',
  height: '110%',
  backgroundColor: 'rgb(255, 255, 255)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  left: '50.5%',
  top: '44%',
  transform: 'translate(-50%, -50%)', 
  zIndex: -2,
};

const blackOutline: React.CSSProperties = {
  position: 'absolute',
  width: '115%',
  height: '115%',
  backgroundColor: 'rgb(0, 0, 0)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  left: '50.5%',
  top: '44%',
  transform: 'translate(-50%, -50%)', 
  zIndex: -3,
};

// middle divider
const verticalDivider: React.CSSProperties = {
  backgroundColor: 'black',
  width: '5px',
  height: '100%',
  position: 'fixed',
  top: '100px',
  left: '33.33%',
  zIndex: 1,
};

// header
const header: React.CSSProperties = {
  userSelect: 'none',
  backgroundColor: '#BA0000',
  color: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '10vh',
  fontFamily: 'microgramma-extended, sans-serif',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  width: '100%',
  height: '18%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  borderBottom: '5px solid black',
};

const leftHeader: React.CSSProperties = {
  fontSize: '8vh',
  color: 'white',
  marginLeft: '5vh',
  marginTop: '2%',
  width: '2.5%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const centerHeader: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '8%',
  transform: 'translateX(0)',
  width: 'auto',
  padding: '8px',
  fontFamily: '"microgramma-extended", sans-serif',
  fontWeight: 700,
  fontStyle: 'normal',
  fontSize: '7vh',
  letterSpacing: '5px',
  marginTop: '1.5%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const logo: React.CSSProperties = {
  position: 'absolute',
  top: '25%',
  left: '90%',
  width: '10vh',
};

const backArrowStyle: React.CSSProperties = {
  color: 'white',
  zIndex: 3,
};

export default OtherProfilePage;