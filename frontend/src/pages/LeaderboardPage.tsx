import React, { useState, useEffect, useRef } from 'react';
import GreyBackground from '../components/Images/GreyBackground';
import logoImage from '../assets/logo.png';
import { Link } from 'react-router-dom';

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

  // functions
  const [powerLevel, setPowerLevel] = useState(0);
  const [TopPowerLevels, setTopPowerLevels] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const isUserRow = (entry: any) => entry.userId === userId;

  const [displayName, setDisplay] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userRank, setUserRank] = useState(0);

  const [friendsLoaded, setFriendsLoaded] = useState(false);

  const resetAndFetch = (targetPage = 1) => {
    setPage(targetPage);
    setHasMore(true);
    setLoading(false); 
    if (isGlobal) {
      setTopPowerLevels([]);
    } else {
      if (!friendsLoaded) {
        setFriends([]);
      }
    }
  
    setTimeout(() => {
      fetchData(1);
    }, 0);
  };

  useEffect(() => {
    resetAndFetch(1);
  }, [isGlobal]);

  // getProfile API
  useEffect(() => {
    async function getProfile(): Promise<void> {
      const response = await fetch(buildPath('api/getProfile'), { // change URL for actual website
        method: 'POST', 
        body: JSON.stringify({ userId: userId }),
        headers: { 'Content-Type': 'application/json' },
      });

      let res = JSON.parse(await response.text());

      setDisplay(res.profile.displayName);
      setPowerLevel(res.profile.powerlevel);
    }

    getProfile();
  }, [userId]);

  useEffect(() => {
    if (!isGlobal && !friendsLoaded) {
      async function searchFriends(): Promise<void> {
        const response = await fetch(buildPath('api/searchFriends'), {
          method: 'POST',
          body: JSON.stringify({ userId }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        const res = await response.json();
        const userFriend = {
          userId: userData.userId,
          displayName: displayName,
          powerlevel: powerLevel,
        };
  
        const updatedFriends = [userFriend, ...res.friendResults];
        setFriends(updatedFriends);
        setFriendsLoaded(true);
      }
  
      searchFriends();
    }
  }, [isGlobal, friendsLoaded, userId, powerLevel, userData.displayName]);
  
  // lazy fetch leaderboard
  const fetchData = async (fetchPage = page) => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    const endpoint = isGlobal ? 'api/getTopPowerlevels' : 'api/getTopFriendPowerLevels';
  
    try {
      const response = await fetch(buildPath(`${endpoint}`), {
        method: 'POST',
        body: JSON.stringify({ userId, page: fetchPage }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const res = await response.json();
  
      if (res.error) {
        console.error(res.error);
        return;
      }
  
      const newProfiles = res.topProfiles.map((profile: any, index: number) => ({
        ...profile,
        rank: (fetchPage - 1) * 10 + index + 1,
      }));
  
      if (isGlobal) {
        setTopPowerLevels(prev => fetchPage === 1 ? newProfiles : [...prev, ...newProfiles]);
        setUserRank(res.userRank ?? 0);      
      } else {
        setFriends(prev => fetchPage === 1 ? newProfiles : [...prev, ...newProfiles]);
      }
  
      setHasMore(newProfiles.length === 10);
      setPage(fetchPage + 1);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, isGlobal]);

  // lazy load on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) return;

      if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 100) {
        fetchData();
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchData]);

  const handleMouseEnter = (index: number) => setHoveredRow(index);
  const handleMouseLeave = () => setHoveredRow(null);

  const handleTabChange = (global: boolean) => {
    if(global){
      resetAndFetch(1);
    }
    setIsGlobal(global);

  };
  

  // main return
  return (
    <div>
      <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <GreyBackground />
      </div>

      {/* Header */}
      <header style={header}>
        <div style={leftHeader} 
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}>
          <Link to="/dashboard" style={backArrowStyle}>&lt;</Link>
        </div>
        <div style={centerHeader}>LEADERBOARD</div>
        <img src={logoImage} alt="Logo" style={logo} />
      </header>

      {/* Tabs to toggle between leaderboards */}
      <div style={tabWrapper}>
        <button style={tabButton(isGlobal)} onClick={() => handleTabChange(true)}>Global</button>
        <button style={tabButton(!isGlobal)} onClick={() => handleTabChange(false)}>Friends</button>
      </div>

      {/* Leaderboard */}
      <div style={leaderboardWrapper}>
        <div ref={scrollAreaRef} style={scrollArea}>
          <div style={leaderboardHeader}>
            <div style={columnStyle('rgb(255, 255, 0)')}>#</div>
            <div style={columnStyle('rgb(255, 255, 0)', true)}>Username</div>
            <div style={columnStyle('rgb(255, 255, 0)')}>Power Level</div>
          </div>

          {/* Global Leaderboard */}
          {isGlobal ? (
              TopPowerLevels.sort((a, b) => b.powerlevel - a.powerlevel).map((entry, index) => (
                <Link to={`/profile/${entry.userId}`} key={index} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      ...getLeaderboardRowStyle(hoveredRow === index),
                      backgroundColor: isUserRow(entry)
                        ? 'rgb(205, 205, 205)'
                        : (hoveredRow === index ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)'),
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={columnStyle('transparent')}>{index + 1}</div>
                    <div style={columnStyle('transparent', true)}>{entry.displayName}</div>
                    <div style={columnStyle('transparent')}>{entry.powerlevel}</div>
                  </div>
                </Link>
              )
            )
          ) : (
            // Friends Leaderboard
              friends.sort((a, b) => b.powerlevel - a.powerlevel).map((entry, index) => (
                <Link to={`/profile/${entry.userId}`} key={index} style={{ textDecoration: 'none' }}>
                  <div
                    key={index}
                    style={{
                      ...getLeaderboardRowStyle(hoveredRow === index),
                      backgroundColor: isUserRow(entry)
                      ? 'rgb(205, 205, 205)' 
                      : (hoveredRow === index ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)'),
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={columnStyle('transparent')}>{index + 1}</div>
                    <div style={columnStyle('transparent', true)}>{entry.displayName}</div>
                    <div style={columnStyle('transparent')}>{entry.powerlevel}</div>
                  </div>
                </Link>
              ))
            )
          }
        </div>
      </div>

      {/* Score Parallelogram */}
      <div style={parallelogramWrapper}>
        <div style={parallelogramContent}>
          <div style={parallelogramText}>Your Score:</div>
          <div style={parallelogramScore}>{powerLevel} (#{userRank})</div> 
        </div>
      </div>
    </div>
  );
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

// leaderboard
const leaderboardWrapper: React.CSSProperties = {
  position: 'absolute',
  top: '222px',
  left: '10%',
  width: '80%',
  height: '63%',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  border: '4px solid black',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.62)',
  overflow: 'hidden',
  userSelect: 'none',
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
  transform: isHovered ? 'scale(1)' : 'scale(1)',
  backgroundColor: isHovered ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)',
  zIndex: 3,
  border: '2px solid #ccc',
});

const scrollArea: React.CSSProperties = {
  overflowY: 'scroll',
  height: '99%',
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
  userSelect: 'none',
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
  zIndex: 6,
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
  userSelect: 'none',
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
