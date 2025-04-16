import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import logoImage from '../../assets/logo.png';

import profile1 from '../../assets/profile1.png';
import profile2 from '../../assets/profile2.png';
import profile3 from '../../assets/profile3.png';
import profile4 from '../../assets/profile4.png';
import profile5 from '../../assets/profile5.png';
import profile6 from '../../assets/profile6.png';
import profile7 from '../../assets/TheHolyOne.png';

const NavigationBar: React.FC = () => {
  const _ud = localStorage.getItem('user_data');
  if (!_ud) {
    console.error('No user data found');
    return;
  }
  const userData = JSON.parse(_ud);
  let userId = '';
  userId = userData.userId;

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

  const profilePictures = [profile1, profile2, profile3, profile4, profile5, profile6, profile7];
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<number>(0);

  useEffect(() => {
      getProfile();
    }, []);

  async function getProfile(): Promise<void> {
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/getProfile'), {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    let res = JSON.parse(txt);
    
    setProfilePicture(res.profile.profilePicture);
  }

  return (
    <header style={header}>
      {/* Left Section */}
      <div
        style={{ ...leftHeader, cursor: 'pointer' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={() => navigate("/")}
      >
        <div style={backArrowStyle}>&lt;</div>
        <div style={logoutText}>LOGOUT</div>
      </div>

      {/* Center Section */}
      <div style={centerHeader}>
        DASHBOARD
      </div>

      {/* Right Section */}
      <div style={rightHeader}>
        <div
          style={clickableIconWrapper}
          onClick={() => navigate('/leaderboard')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img src={logoImage} alt="logo" style={logoImageStyle} />
        </div>

        <div
          style={clickableIconWrapper}
          onClick={() => navigate('/profile')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img src={profilePictures[profilePicture]} alt="Profile" style={profileImageStyle} />
        </div>
      </div>
    </header>
  )
};

const rightHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5vw',
  marginRight: '3vw',
};

const clickableIconWrapper: React.CSSProperties = {
  marginTop: '15%',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
};

const profileImageStyle: React.CSSProperties = {
  width: '5vw',
  height: '5vw',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '6px solid black',
};

const logoImageStyle: React.CSSProperties = {
  width: '6vw',
  transition: 'transform 0.2s ease-in-out',
};

const centerHeader: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '7vh',
  letterSpacing: '5px',
  whiteSpace: 'nowrap',
};

const header: React.CSSProperties = {
  userSelect: 'none',
  backgroundColor: '#BA0000',
  color: 'white',
  fontFamily: 'microgramma-extended, sans-serif',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  width: '100%',
  height: '18%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  borderBottom: '5px solid black',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2vw',
  fontSize: '10vh',
};

const leftHeader: React.CSSProperties = {
  fontSize: '8vh',
  color: 'white',
  marginLeft: '7.5vw',
  width: '2.5%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const logoutText: React.CSSProperties = {
  fontSize: '2vw',
};

const backArrowStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '60px',
  zIndex: 3,
};

export default NavigationBar;