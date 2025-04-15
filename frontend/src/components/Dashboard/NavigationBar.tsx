import React, { useEffect, useRef, useState } from 'react';
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

  /*
  <button className="button" style={button} onClick={handleRedirectLogout}>&#60;</button>
      <span>Dashboard</span>
      <button className="button" style={button} onClick={handleRedirectLeaderboard}>Leaderboard</button>
      <button className="button" style={button} onClick={handleRedirectProfile}>Profile</button>
  */

  return (
    <header style={header}>
      <div
        style={{...leftHeader, cursor: 'pointer'}}
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
      <div style={centerHeader}>
        DASHBOARD
      </div>
      <div
        style={{ ...clickableIconWrapper, left: '85%' }}
        onClick={() => navigate('/leaderboard')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img src={logoImage} alt="logo" style={logoImageStyle} />
      </div>

      <div
        style={{ ...clickableIconWrapper, left: '92%' }}
        onClick={() => navigate('/profile')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img src={profilePictures[profilePicture]} alt="Profile" style={profileImageStyle} />
      </div>
    </header>
  );
};

const clickableIconWrapper: React.CSSProperties = {
  position: 'absolute',
  top: '20%',
  left: '10%',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
};

const logoImageStyle: React.CSSProperties = {
  width: '10vh',
};

const header: React.CSSProperties = {
  userSelect: 'none',
  backgroundColor: '#BA0000',
  color: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontSize: '4vh',
  gap: '1vh',
  marginLeft: '5.4vh',
  marginTop: '3.1vh',
  width: '8%',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
};

const logoutText: React.CSSProperties = {
  fontSize: '2vh',
};


const centerHeader: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)', 
  width: 'auto',
  padding: '8px',
  fontSize: '7vh',
  letterSpacing: '5px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const profileImageStyle: React.CSSProperties = {
  width: '10vh',
  height: '10vh',
  position: 'absolute',
  borderRadius: '50%',
  objectFit: 'cover',
  top: '20%',
  margin: '0 auto',
  border: '6px solid black',
  left: '95%',
};

const backArrowStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '8vh',
  zIndex: 3,
};

export default NavigationBar;