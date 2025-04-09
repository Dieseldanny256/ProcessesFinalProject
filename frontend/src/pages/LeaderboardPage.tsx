import React, { useState, useEffect, useRef } from 'react';
import GreyBackground from '../components/Images/GreyBackground';
import logoImage from '../assets/logo.png';

const LeaderboardPage: React.FC = () => {
  const [isGlobal, setIsGlobal] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // get local data
  const _ud = localStorage.getItem('user_data');
  if (!_ud) {
    console.error('No user data found');
    return;
  }

  const userData = JSON.parse(_ud);
  let userId = '';
  userId = userData.userId;

  // functions to save variables from API
  const [powerLevel, setPowerLevel] = useState(0);
  const [TopPowerLevels, SetTopPowerLevels] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  //searchFriends API - get friends for leaderboard
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

  // getProfile API - to get powerlevel, and rank soon?
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

      setPowerLevel(res.profile.powerlevel);
    }

    getProfile();
  }, [userId]);

  // getTopPowerlevels API - for leaderboard, needs better solution.
  useEffect(() => {
    async function getTopPowerlevels(): Promise<void> {
      let obj = { userId: userId };
      let js = JSON.stringify(obj);

      const response = await fetch('http://localhost:5000/api/getTopPowerlevels', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      let txt = await response.text();
      let res = JSON.parse(txt);

      const cappedTopProfiles = res.topProfiles.map((profile: any) => ({
        ...profile,
        rank: Math.max(0, Math.min(100, profile.rank)),
      }));
      
      SetTopPowerLevels(cappedTopProfiles);
    }

    getTopPowerlevels();
  }, [userId]);

  // TODO - visiting other profiles
  const handleRowClick = (rank: number) => {
    window.location.href = `/profile/${rank}`;
  };

  const handleMouseEnter = (rank: number) => {
    setHoveredRow(rank);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  // main return
  return (
    <div>
      <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0 }}>
        <GreyBackground />
      </div>

      {/* Header */}
      <header style={header}>
        <div style={leftHeader}>
          <a href="/dashboard" style={backArrowStyle}>&lt;</a>
        </div>
        <div style={centerHeader}>LEADERBOARD</div>
        <img src={logoImage} alt="Logo" style={logo} />
      </header>

      {/* Tabs to toggle between leaderboards */}
      <div style={tabWrapper}>
        <button style={tabButton(isGlobal)} onClick={() => setIsGlobal(true)}>Global</button>
        <button style={tabButton(!isGlobal)} onClick={() => setIsGlobal(false)}>Friends</button>
      </div>

      {/* Leaderboard */}
      <div style={leaderboardWrapper}>
        <div ref={scrollAreaRef} style={scrollArea}>
          {/* Leaderboard Header*/}
          <div style={leaderboardHeader}>
            <div style={columnStyle('rgb(255, 255, 0)')}>#</div>
            <div style={columnStyle('rgb(255, 255, 0)', true)}>Username</div>
            <div style={columnStyle('rgb(255, 255, 0)')}>Power Level</div>
          </div>
          {/* Leaderboard Body*/}
          {(isGlobal ? TopPowerLevels : friends)
            .sort((a, b) => b.powerlevel - a.powerlevel)
            .map((entry, index) => (
              <div
                key={index}
                style={getLeaderboardRowStyle(hoveredRow === entry.rank)}
                onClick={() => handleRowClick(entry.rank)}
                onMouseEnter={() => handleMouseEnter(entry.rank)}
                onMouseLeave={handleMouseLeave}
              >
                <div style={columnStyle('white')}>{index + 1}</div>
                <div style={columnStyle('white', true)}>{entry.displayName}</div>
                <div style={columnStyle('white')}>{entry.powerlevel}</div>
              </div>
            ))}
        </div>
      </div>


      {/* Score Parallelogram */}
      <div style={parallelogramWrapper}>
        <div style={parallelogramContent}>
          <div style={parallelogramText}>Your Score:</div>
          <div style={parallelogramScore}>{powerLevel} (#15)</div> 
        </div>
      </div>
    </div>
  );
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

const backArrowStyle: React.CSSProperties = {
  fontSize: '70px',
  color: 'white',
  textDecoration: 'none',
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
  left: '10%',
  transform: 'translateX(0)',
  width: 'auto',
  padding: '8px',
  fontFamily: '"microgramma-extended", sans-serif',
  fontWeight: 700,
  fontStyle: 'normal',
  fontSize: '70px',
  letterSpacing: '5px',
  marginTop: '25px',
};

const logo: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '90%',
  width: '100px',
  marginTop: '40px',
};

// leaderboard
const leaderboardWrapper: React.CSSProperties = {
  position: 'absolute',
  top: '222px',
  left: '10%',
  width: '80%',
  height: '70%',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  border: '4px solid black',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.62)',
  overflow: 'hidden',
};

const leaderboardHeader: React.CSSProperties = {
  display: 'flex',
  fontSize: '24px',
  borderBottom: '3px solid black',
  color: '#000',
  height: '60px',
  alignItems: 'center',
  boxSizing: 'border-box',
  overflow: 'hidden',
  justifyContent: 'space-between',
};

const columnStyle = (bgColor: string, grow = false): React.CSSProperties => ({
  fontFamily: 'microgramma-extended, sans-serif',
  backgroundColor: bgColor,
  flex: grow ? 2 : 1,
  padding: '0 15px',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  textAlign: 'center',
  borderRight: '1px solid black',
  borderBottom: '1px solid black',
  height: '100%',
});

const getLeaderboardRowStyle = (isHovered: boolean): React.CSSProperties => ({
  display: 'flex',
  fontSize: '18px',
  color: 'rgb(32, 32, 32)',
  height: '50px',
  borderBottom: '2px solid #ccc',
  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  zIndex: isHovered ? 10 : 1,
  border: isHovered ? '2px solid rgba(0, 0, 0, 0.3)' : '1.5px solid rgba(0, 0, 0, 0.2)',
});

const scrollArea: React.CSSProperties = {
  overflowY: 'auto',
  height: '100%',
};

// tabs
const tabWrapper: React.CSSProperties = {
  position: 'absolute',
  top: '180px',
  right: '9.4%',
  zIndex: 5,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: '0px',
};

const tabButton = (active: boolean): React.CSSProperties => ({
  backgroundColor: active ? '#BA0000' : 'rgb(255, 255, 255)',
  color: active ? 'white' : '#BA0000',
  border: `3px solid rgb(0, 0, 0)`,
  padding: '8px 12px',
  fontSize: '18px',
  fontFamily: 'microgramma-extended, sans-serif',
  cursor: 'pointer',
  borderRadius: '5px',
  transition: '0.3s',
  textTransform: 'uppercase',
});

// parallelogram
const parallelogramWrapper: React.CSSProperties = {
  position: 'absolute',
  fontFamily: 'microgramma-extended, sans-serif',
  bottom: '40px',
  left: '40px',
  zIndex: 3,
  transform: 'skew(-20deg)',
  border: '4px solid black',
  backgroundColor: '#BA0000',
  boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
};

const parallelogramContent: React.CSSProperties = {
  transform: 'skew(20deg)',
  padding: '20px',
  color: 'white',
  textAlign: 'center',
};

const parallelogramText: React.CSSProperties = {
  fontSize: '2vw',
};

const parallelogramScore: React.CSSProperties = {
  fontSize: '2.5vw',
};

export default LeaderboardPage;
