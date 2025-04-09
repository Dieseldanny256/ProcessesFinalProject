import React, { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import GreyBackground from '../components/Images/GreyBackground.tsx'; 
import profileImage from '../assets/profile.png';
import logoImage from '../assets/logo.png';

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

const ProfilePage: React.FC = () => {
  // TODO - friends
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ displayName: string; userId: string }[]>([]);

  // get local data
  const _ud = localStorage.getItem('user_data');
  if (!_ud) {
    console.error('No user data found');
    return;
  }

  const userData = JSON.parse(_ud);

  let userId = '';
  let displayName = '';
  
  userId = userData.userId;
  displayName = userData.displayName;

  // functions to store variables from the API
  const [powerLevel, setPowerLevel] = useState(0);
  const [stats, setStats] = useState(0);
  const [friends, setFriends] = useState(0);

  // getProfile API gets powerlevel, and stats
  useEffect(() => {
    async function getProfile(): Promise<void> {
      let obj = { userId: userId };
      let js = JSON.stringify(obj);

      const response = await fetch('http://localhost:5000/api/getProfile', { // change URL for actual website
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let txt = await response.text();
      let res = JSON.parse(txt);

      setStats(res.profile.stats);
      setPowerLevel(res.profile.powerlevel);
    }

    getProfile();
  }, [userId]);

  // searchFriends API gets friends and their variables
  useEffect(() => {
    async function searchFriends(): Promise<void> {
      let obj = { userId: userId };
      let js = JSON.stringify(obj);

      const response = await fetch('http://localhost:5000/api/searchFriends', { // change URL for actual website
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let txt = await response.text();
      let res = JSON.parse(txt);
      setFriends(res.friendResults);
      console.log(res);
    }

    searchFriends();
  }, [userId]);

  // chart values
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

  // chart styling
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

  // TODO - friends
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchResults([
    ]);
  };

  // main return
  return (
    <div>
      {/* Header Area */}
      <header style={header}>

        {/* Back Arrow */}
        <div style={leftHeader} 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
          <Link to="/dashboard" style={backArrowStyle}>&lt;</Link>
        </div>
        
        {/* Username */}
        <div style={centerHeader}>
          {displayName}
        </div>
        
        {/* Powerlevel Logo */}
        <img src={logoImage} alt="logo" style={logo} />
        <div style={powerLevelTextStyle}>Power Level: {powerLevel}</div>
      </header>

      <GreyBackground />
      
      {/* Left Section - Picture and Chart */}
      <div style={leftSection}>

        {/* Picture */}
        <img src={profileImage} alt="Profile" style={profileImageStyle} />
        
        {/* Chart */}
        <div style={hexagonWrapper}>
          <div style={blackOutline}></div>
          <div style={labelBackground}></div>
          <div style={hexagonBackground}></div>
          <Radar ref={chartRef} data={radarData} options={config.options} />
        </div>
      </div>

      <div style={verticalDivider}></div>

      {/* Right Section - Friends */}
      <div style={rightSection}>

        {/* Friend Header */}
        <div style={friendHeader}>
          <h1>Friends</h1>
          <button onClick={handleOpenModal} style={plusButtonStyle}>+</button>
        </div>
        
        {/* Friend Box */}
        <div style={friendListContainer}>
          <div style={friendList}>
            {Array.isArray(friends) && friends.length > 0 ? (
              friends.map((friend, index) => (
                <div 
                  key={index}
                  style={friendItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={friendImageWrapper}>
                    <img 
                      src={friend.profileImage || profileImage} 
                      alt="Friend" 
                      style={friendProfileImageStyle} 
                    />
                  </div>
                  <div style={friendNameWrapper}>
                    <span style={friendNameStyle}>{friend.displayName}</span>
                    <span style={friendPowerLevelStyle}>{friend.powerlevel}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={noFriendsStyle}>No friends yet</div>
            )}
          </div>
        </div>

      </div>
      
      {/* Adding Friends - TODO */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h1 style={searchTitle}>Add a Friend</h1>
            <h1 style={searchComment}>You can add a friend with their UserName</h1>
            <h2>Search for a Friend</h2>
            <input type="text" value={searchQuery} onChange={handleSearchChange} style={searchInputStyle} placeholder="Search for a friend"/>
            <button onClick={handleSearchSubmit} style={searchButtonStyle}>Search</button>

            {searchResults.length > 0 && (
              <div style={searchResultsStyle}>
                {searchResults.map((result, index) => (
                  <div key={index} style={searchResultItemStyle}>
                    {result.displayName}
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleCloseModal} style={closeModalButtonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
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

const plusButtonStyle: React.CSSProperties = {
  backgroundColor: '#BA0000',
  color: 'white',
  fontSize: '20px',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '6px',
  paddingBottom: '6px',
  cursor: 'pointer',
  border: '3px solid #ccc',
};

const friendImageWrapper: React.CSSProperties = {
  width: '40px',
  height: '40px',
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

// add friend TODO
const searchTitle: React.CSSProperties = {
  color: '#000',
  fontSize: '30px',
};
const searchComment: React.CSSProperties = {
  color: 'rgb(48, 48, 48)',
  fontSize: '20px',
};

const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
};

const modalContent: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  left: 0,
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const searchButtonStyle: React.CSSProperties = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '10px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
};

const searchResultsStyle: React.CSSProperties = {
  marginTop: '20px',
};

const searchResultItemStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#f9f9f9',
  marginBottom: '10px',
  cursor: 'pointer',
};

const closeModalButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '10px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
};


const powerLevelTextStyle: React.CSSProperties = {
  position: 'absolute',
  top: '120px',  
  left: '8.6%',
  fontFamily: '"microgramma-extended", sans-serif',
  fontSize: '30px',
  color: 'rgb(230, 230, 230)',
};

// left area with picture and chart
const leftSection: React.CSSProperties = {
  color: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '20px',
  fontFamily: 'microgramma-extended, sans-serif',
  width: '33.33%',
  height: '100%',
  position: 'fixed',
  left: 0,
  top: '30%',
};

const profileImageStyle: React.CSSProperties = {
  width: '300px', 
  height: '300px',
  position: 'relative',
  borderRadius: '50%',  
  objectFit: 'cover',  
  top: '-60px',
  border: '6px solid black',  
};

// chart
const hexagonWrapper: React.CSSProperties = {
  position: 'relative',
  top: '0px',
  width: '300px',
  height: '300px',
  margin: '0 auto',
};

const hexagonBackground: React.CSSProperties = {
  position: 'absolute',
  top: '21px',
  left: '40px',
  width: '224px',
  height: '258px',
  backgroundColor: 'rgb(209, 209, 209)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  zIndex: -1,
};

const labelBackground: React.CSSProperties = {
  position: 'absolute',
  top: '-20px',
  left: '-3px',
  width: '310px',
  height: '340px',
  backgroundColor: 'rgb(255, 255, 255)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  zIndex: -1,
};

const blackOutline: React.CSSProperties = {
  position: 'absolute',
  top: '-25px',
  left: '-8px',
  width: '320px',
  height: '350px',
  backgroundColor: 'rgb(0, 0, 0)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  zIndex: -1,
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
  backgroundColor: '#BA0000',
  color: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '100px',
  fontFamily: 'microgramma-extended, sans-serif',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  borderBottom: '5px solid black',
};

const leftHeader: React.CSSProperties = {
  textAlign: 'left',
  fontSize: '100px',
  color: 'white',
  textDecoration: 'none',
  marginBottom: '20px',
  marginLeft: '15px',
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
  fontSize: '70px',
  letterSpacing: '5px',
  marginTop: '25px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const logo: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '90%',
  width: '100px',
  marginTop: '40px',
};

const backArrowStyle: React.CSSProperties = {
  fontSize: '70px',
  color: 'white',
  textDecoration: 'none',
  paddingLeft: '10px',
  zIndex: 3,
};

export default ProfilePage;