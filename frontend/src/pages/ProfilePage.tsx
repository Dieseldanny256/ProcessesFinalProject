import React, { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import GreyBackground from '../components/Images/GreyBackground'; 
import logoImage from '../assets/logo.png';
import flameGif from '../assets/flame.gif';

import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';
import profile5 from '../assets/profile5.png';
import profile6 from '../assets/profile6.png';
import profile7 from '../assets/TheHolyOne.png';

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

const ProfilePage: React.FC = () => {
  const profilePictures = [profile1, profile2, profile3, profile4, profile5, profile6, profile7];

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPictureOpen, setIsModalPictureOpen] = useState(false);
  
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<{profilePicture: number; displayName: string; userId: string }[]>([]);
  
  const [powerLevel, setPowerLevel] = useState(0);
  const [stats, setStats] = useState<number[]>([]);
  const [profilePicture, setProfilePicture] = useState<number>(0);

  const [friends, setFriends] = useState<{ displayName: string; profileImage: string; powerlevel: number; userId: number; profilePicture: number}[]>([]);
  const [displayName, setDisplay] = useState<string>('');
  const [requestResults, setRequestResults] = useState<{ displayName: string; profilePicture: number; userId: number}[]>([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState<number[]>([]);
  const [friendIds, setFriendIds] = useState<number[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredIndexModal, setHoveredIndexModal] = useState<number | null>(null);
  
  const [loadingFriends, setLoadingFriends] = useState(true);

  const [selectedPictureIndex, setSelectedPictureIndex] = useState<number | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [streak, setStreak] = useState<number>(0);

  const _ud = localStorage.getItem('user_data');
  
  if (!_ud) {
    console.error('No user data found');
    return;
  }

  const userData = JSON.parse(_ud);

  let userId = '';
  userId = userData.userId;

  useEffect(() => {
    getProfile();
    searchFriends();
    searchRequests();
  }, []);
  
  async function getProfile(): Promise<void> {
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/getProfile'), { // change URL for actual website
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    let res = JSON.parse(txt);

    setProfilePicture(res.profile.profilePicture);
    setDisplay(res.profile.displayName);
    setStats(res.profile.stats || []);
    setPowerLevel(res.profile.powerlevel);
    setStreak(res.profile.streak);
  }

  async function updateProfilePicture(profilePicture: number): Promise<void> {
    const obj = {
      userId: userId,
      profilePicture: profilePicture,
    };
  
    const js = JSON.stringify(obj);
  
    try {
      const response = await fetch(buildPath('api/updateProfilePicture'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to update profile picture');
  
      setProfilePicture(profilePicture);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }
  

  async function searchFriends(): Promise<void> {
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/searchFriends'), { // change URL for actual website
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    let res = JSON.parse(txt);

    setFriends(res.friendResults || []);
    setFriendIds((res.friendResults || []).map((friend: { userId: any; }) => friend.userId));
    setLoadingFriends(false);
  }

  async function searchRequests(): Promise<void> {
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/searchRequests'), { // change URL for actual website
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    let res = JSON.parse(txt);

    setRequestResults(res.requestResults || []);
    setFriendRequestsSent(res.friendRequestsSent || []);
    setLoadingFriends(false);
  }

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModalPicture = () => {
    setIsModalPictureOpen(true);
  };

  const handleCloseModalPicture = () => {
    setIsModalPictureOpen(false);
    setSelectedPictureIndex(null);
    setConfirmationMessage('');
  };

  const handlePictureSelect = (index: number) => {
    setSelectedPictureIndex(index);
    setConfirmationMessage('Profile Picture Changed');

    updateProfilePicture(index)

    setTimeout(() => {
      setConfirmationMessage('');
    }, 2000);
  };
  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const refreshUserData = async () => {
    const _ud = localStorage.getItem('user_data');
  
    if (!_ud) {
      console.error('No user data found');
      return;
    }

    const userData = JSON.parse(_ud);

    userId = userData.userId;
  };

  const pulseAnimation = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  const dynamicExclamationStyle = {
    ...exclamationMarkStyle,
    animation: 'pulse 1s infinite',
  };

  const refresh = async () => {
    await refreshUserData();
    await getProfile();
    await searchFriends();
  };

  const refreshModalRequests = async () => {
    await refreshUserData();
    await getProfile();
    await searchFriends();
    await searchRequests();
  };

  const searchProfiles = async () => {
    const response = await fetch(buildPath('api/searchProfiles'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({searchText}),
    });
    
    const data = await response.json();
    setSearchResults(data.matchingProfiles || []);

    refresh();
  };

  // delete friend
  const deleteFriend = async (friendUserId: string) => {
    await fetch(buildPath('api/deleteFriend'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendUserId }),
    });
  
    setFriendIds(prev => prev.filter(id => id !== parseInt(friendUserId)));

    refresh();
  };

  const [hovered, setHovered] = useState(false);

  const sendFriendRequest = async (friendUserId: string) => {
    await fetch(buildPath('api/sendFriendRequest'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendUserId }),
    });
  
    setFriendRequestsSent(prev => [...prev, parseInt(friendUserId)]);

    refresh();
  };

  const denyFriendRequest = async (friendUserId: Number) => {
    await fetch(buildPath('api/denyFriendRequest'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receivingUserId: userId,
        sendingUserId: friendUserId,
      }),
    });
    
    refreshModalRequests();
  };
  
  const acceptFriendRequest = async(friendUserId: Number) => {
    await fetch(buildPath('api/addFriend'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId: userId, friendUserId: friendUserId}),
    })

    refreshModalRequests();
  }

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
          onClick={() => navigate("/dashboard")}
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
            <button onClick={handleOpenModalPicture} 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ ...editButtonStyle,
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}>
              Edit
            </button>
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={handleOpenModal} style={plusButtonStyle}>
              +
            </button>
            {requestResults.length > 0 && (
              <div>
                <style>{pulseAnimation}</style>
                <span style={dynamicExclamationStyle}>!</span>
              </div>
            )}
          </div>
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

      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={topModal}>
              <div style={searchTitle}>
                <h1>Send Friend Request</h1>
              </div>
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                style={searchInputStyle}
                placeholder="Search for a friend"
              />
              <button onClick={searchProfiles} style={searchButtonStyle}>
                Search
              </button>
              <div style={searchArea}>
                {searchResults.length > 0 ? (
                  searchResults
                    .filter(result => Number(result.userId) !== Number(userId))
                    .map((result, index) => {
                    const isRequestSent = friendRequestsSent.includes(Number(result.userId));
                    const isAlreadyFriend = friendIds.includes(Number(result.userId));

                    return (
                      <div
                        key={result.userId}
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Link
                          to={`/profile/${result.userId}`}
                          style={{
                            ...modalItem,
                            backgroundColor: hoveredIndexModal === index ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={() => setHoveredIndexModal(index)}
                          onMouseLeave={() => setHoveredIndexModal(null)}
                        >
                          <div style={modalImageWrapper}>
                            <img
                              src={profilePictures[result.profilePicture]}
                              alt="Friend"
                              style={friendProfileImageStyle}
                            />
                          </div>
                          <div style={modalNameWrapper}>
                            <span style={modalNameStyle}>{result.displayName}</span>
                          </div>
                        </Link>
                        <button
                          style={{
                            ...sendRequestButton,
                            backgroundColor: isAlreadyFriend 
                              ? '#dc3545'
                              : isRequestSent
                              ? '#6c757d'
                              : '#28a745',
                            cursor: isAlreadyFriend
                              ? 'pointer'
                              : isRequestSent
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                          onClick={() => {
                            if (isAlreadyFriend) {
                              const confirmDelete = window.confirm(`Are you sure you want to remove ${result.displayName} as a friend?`);
                              if (confirmDelete) {
                                console.log('deleted friend');
                                deleteFriend(result.userId);
                              }
                              } else if (!isRequestSent) {
                                console.log('sent friend request');
                                sendFriendRequest(result.userId);
                              }
                          }}
                        >
                          {isAlreadyFriend ? 'Remove' : isRequestSent ? 'Sent' : 'Send'}
                      </button>
                      </div>
                    );
                  })
                ) : (
                  <div style={searchComment}>No results found.</div>
                )}
              </div>
              <button onClick={handleCloseModal} style={closeModalButtonStyle}>Close</button>
            </div>
            <div style={bottomModal}> 
              <div style={requestsTitle}> Friend Requests </div>
              <div style={bottomSearchArea}>
                
                {requestResults.length > 0 ? (
                  requestResults.map((result, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Link
                        to={`/profile/${result.userId}`}
                        style={{
                          ...modalItem,
                          backgroundColor: hoveredIndexModal === index ? 'rgb(230, 230, 230)' : 'rgb(255, 255, 255)',
                          display: 'flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={() => setHoveredIndexModal(index)}
                        onMouseLeave={() => setHoveredIndexModal(null)}
                      >
                        <div style={modalImageWrapper}>
                          <img
                            src={profilePictures[result.profilePicture]}
                            alt="Friend"
                            style={friendProfileImageStyle}
                          />
                        </div>
                        <div style={modalNameWrapper}>
                          <span style={modalNameStyle}>{result.displayName}</span>
                        </div>
                      </Link>
                      <button
                        style={{
                          ...sendRequestButton,
                          backgroundColor: '#28a745',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          acceptFriendRequest(result.userId);
                          denyFriendRequest(result.userId);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        style={{
                          ...sendRequestButton,
                          backgroundColor: '#dc3545',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          denyFriendRequest(result.userId);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  );
                })
              ) : (
                <div style={searchComment}>No requests found.</div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalPictureOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={pictureTitle}>
              <h1>Select Profile Picture</h1>
            </div>
            <div style={pictureSearchArea}>
              {profilePictures.slice(0, 6).map((src, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${26.5 + (index % 3) * 32}%`,
                    top: `${32 + Math.floor(index / 3) * 35}%`,
                    textAlign: 'center',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9,
                  }}
                >
                  <img
                    src={src}
                    alt={`Profile ${index}`}
                    style={{
                      ...pictures,
                      border: selectedPictureIndex === index ? '6px solid #28a745' : pictures.border,
                    }}
                  />
                  <button
                    style={{...selectButtonStyle, backgroundColor: selectedPictureIndex === index ? '6px solid #28a745' : 'rgb(43, 43, 43)'}}
                    onClick={() => handlePictureSelect(index)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            {confirmationMessage && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12.5%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '2vh',
                  color: '#00AA00',
                  backgroundColor: 'white',
                  padding: '1vh 2vh',
                  zIndex: 20,
                }}
              >
                {confirmationMessage}
              </div>
            )}

            <button
              onClick={handleCloseModalPicture}
              style={{
                position: 'absolute',
                bottom: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2vh',
                backgroundColor: '#BA0000',
                color: 'white',
                border: '3px solid #ccc',
                borderRadius: '8px',
                padding: '1vh 3vh',
                cursor: 'pointer',
              }}
            >
              Quit
            </button>
          </div>
        </div>
      )}
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

// pivture modal
const pictureSearchArea: React.CSSProperties = {
  height: '47vh',
  width: '56vh',
  marginLeft: '-20%',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  borderRadius: '8px',
};

const selectButtonStyle: React.CSSProperties = {
  transform: 'translate(-50%, -50%)',
  marginTop: '180%',
  backgroundColor: '#28a745',
  color: 'white',
  fontSize: '2vh',
  paddingLeft: '1vh',
  paddingRight: '1vh',
  paddingTop: '0.6vh',
  paddingBottom: '0.6vh',
  cursor: 'pointer',
  border: '3px solid #ccc',
  zIndex: 10,
};

const pictureTitle: React.CSSProperties = {
  position: 'absolute',
  color: '#000',
  fontSize: '1vh',
  left: '18%',
  top: '1%',
};

const pictures: React.CSSProperties = {
  width: '15vh',
  height: '15vh',
  position: 'absolute',
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '0 auto',
  border: '6px solid #ccc',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.81)',
  transform: 'translateX(-50%)', 
};

const exclamationMarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  backgroundColor: 'red',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  animation: 'pulse 1.5s infinite',
  boxShadow: '0 0 5px rgba(0,0,0,0.3)',
  zIndex: 2,
};

const sendRequestButton: React.CSSProperties = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '1vh 0.5vh',
  borderRadius: '8px',
  marginRight: '1vh',
  cursor: 'pointer',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.27)',
  marginLeft: '0.1vh',
  border: '4px solid rgba(0, 0, 0, 0.18)',
  width: '20%',
  marginTop: '1%',
};

const searchTitle: React.CSSProperties = {
  position: 'absolute',
  color: '#000',
  fontSize: '1vh',
  left: '20%',
  top: '1%',
};

const requestsTitle: React.CSSProperties = {
  position: 'absolute',
  color: '#000',
  fontSize: '3vh',
  left: '25%',
  top: '4%',
};

const searchComment: React.CSSProperties = {
  position: 'absolute',
  color: 'rgb(48, 48, 48)',
  fontSize: '20px',
  left: '30%',
  top: '40%',
};

const modalItem: React.CSSProperties = {
  color: 'rgb(48, 48, 48)',
  display: 'flex',
  alignItems: 'center',
  padding: '1vh 2vh',
  fontSize: '2.5vh',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginLeft: '1vh',
  marginRight: '1vh',
  marginBottom: '0',
  marginTop: '0.5vh',
  width: '75%',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.27)',
};

const modalImageWrapper: React.CSSProperties = {
  width: '5vh',
  height: '4.2vh',
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: '15px',
};

const modalNameWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const modalNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

const topModal: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'rgb(255, 255, 255)',
  height: '65%',
  width: '100%',
  left: '0',
  top: '0',
  display: 'flex',
  zIndex: 2,
};

const bottomModal: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'rgb(255, 255, 255)',
  height: '35%',
  width: '100%',
  left: '0',
  top: '63%',
  display: 'flex',
  zIndex: 2,
  borderTop: '5px solid #000',
};

const bottomSearchArea: React.CSSProperties = {
  position: 'absolute',
  height: '70%',
  width: '93%',
  left: '3%',
  top: '25%',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  borderRadius: '8px',
};

const modalOverlay: React.CSSProperties = {
  position: 'absolute',
  fontFamily: 'microgramma-extended, sans-serif',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  userSelect: 'none',
};

const modalContent: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'white',
  padding: '100px',
  borderRadius: '8px',
  width: '40vh',
  height: '50vh',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  border: '5px solid black'
};

const searchArea: React.CSSProperties = {
  position: 'absolute',
  height: '70%',
  width: '93%',
  left: '3%',
  top: '25%',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  borderRadius: '8px',
};

const searchInputStyle: React.CSSProperties = {
  position: 'absolute',
  width: '53%',
  height: '5%',
  left: '3%',
  top: '15%',
  padding: '0.5vh',
  border: '1px solid #000',
  borderRadius: '4px',
  backgroundColor: 'rgb(48,48, 48)',
};

const searchButtonStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#28a745',
  left: '65%',
  top: '15%',
  color: 'white',
  padding: '0.7vh',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  height: '4vh',
};

const closeModalButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  left: '68%',
  top: '15%',
  color: 'white',
  padding: '0.7vh',
  borderRadius: '4px',
  height: '4vh',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
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
  height: '65vh',
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
  marginTop:'5%',
  fontSize: '2.5vh',
  paddingLeft: '1vh',
  paddingRight: '1vh',
  paddingTop: '0.6vh',
  paddingBottom: '0.6vh',
  cursor: 'pointer',
  border: '3px solid #ccc',
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: 'rgb(204, 204, 204)',
  color: 'rgb(0, 0, 0)',
  letterSpacing: '1px',
  position: 'relative',
  top: '85%',
  fontSize: '2.2vh',
  paddingLeft: '1vh',
  paddingRight: '1vh',
  paddingTop: '0.1vh',
  paddingBottom: '0.1vh',
  cursor: 'pointer',
  border: '3px solid #000',
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

export default ProfilePage;