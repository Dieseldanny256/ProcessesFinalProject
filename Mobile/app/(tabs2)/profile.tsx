import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, Pressable, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShrinkingHeaderWrapper from '@/components/ShrinkingHeaderWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
const profileImage = require('@/assets/images/profile.png');
import { router } from 'expo-router';
import Svg, { Polygon } from 'react-native-svg';
import { RadarChart } from '@salmonco/react-native-radar-chart';
import ProtectedeRoute from '@/components/protectedRoute';

const profile1 = require('@/assets/images/profile1.png');
const profile2 = require('@/assets/images/profile2.png');
const profile3 = require('@/assets/images/profile3.png');
const profile4 = require('@/assets/images/profile4.png');
const profile5 = require('@/assets/images/profile5.png');
const profile6 = require('@/assets/images/profile6.png');
const profile7= require('@/assets/images/TheHolyOne.png');

const ProfilePage: React.FC = () => {
  const profilePictures = [profile1, profile2, profile3, profile4, profile5, profile6, profile7];
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<{profilePicture: number; displayName: string; userId: string }[]>([]);
  const [powerLevel, setPowerLevel] = useState(0);
  const [stats, setStats] = useState<number[]>([]);
  const [friends, setFriends] = useState<{ displayName: string; profileImage: string; powerlevel: number; userId: number; profilePicture: number}[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredIndexModal, setHoveredIndexModal] = useState<number | null>(null);
  const [displayName, setDisplay] = useState<string>('');
  const [requestResults, setRequestResults] = useState<{ displayName: string; profilePicture: number; userId: number}[]>([]);

  const [friendRequestsSent, setFriendRequestsSent] = useState<number[]>([]);
  const [friendIds, setFriendIds] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [profilePicture, setProfilePicture] = useState<number>(0);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const _ud = await AsyncStorage.getItem('user_data');
        if (_ud) {
          const userData = JSON.parse(_ud);
          setUserId(userData.userId);
        } else {
          console.warn('No user_data found in AsyncStorage');
        }
      } catch (error) {
        console.error('No user data found');
        return;
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      getProfile();
      searchFriends();
      searchRequests();
    }
  }, [userId]);
  
  async function getProfile(): Promise<void> {
    
    // API profile info Call
    try {
    const obj = { userId };
    const js = JSON.stringify(obj);

    console.log('Fetching profile for userId:', userId);

    const response = await fetch('http://powerleveling.xyz:5000/api/getProfile', { // 'http://localhost:5000/api/getProfile ' change URL for actual website
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    const txt = await response.text();
    console.log("Get Profile Raw response:", response);
    const res = JSON.parse(txt);
    console.log("Get Profile Parsed response:", res);

    if (!res.profile) {
      console.warn('Profile not found in response:', res);
      return;
    }

    setProfilePicture(res.profile.profilePicture);
    setDisplay(res.profile.displayName);
    setStats(res.profile.stats || []);
    setPowerLevel(res.profile.powerlevel);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }

  async function searchFriends(): Promise<void> {

    // API freinds search call
    
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    console.log('Fetching Freinds for userId:', userId);

    const response = await fetch('http://powerleveling.xyz:5000/api/searchFriends', { // change URL for actual website
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    console.log("Search Freinds Raw response:", response);
    let res = JSON.parse(txt);
    console.log("Search Friends Parsed response:", res);

    if (!res.friendResults) {
      console.warn('Friends not found in response:', res);
      return;
    }
    

    

    setFriends(res.friendResults || []);
    setFriendIds((res.friendResults || []).map((friend: { userId: any; }) => friend.userId));
    setLoadingFriends(false);
  }

  async function searchRequests(): Promise<void> {
    
    // API call for searching people
    
    let obj = { userId: userId };
    let js = JSON.stringify(obj);

    console.log('Fetching Requests for userId:', userId);

    const response = await fetch('http://powerleveling.xyz:5000/api/searchRequests', {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    let txt = await response.text();
    console.log("Search Requests Raw response:", response);
    let res = JSON.parse(txt);
    console.log("Search Requests Parsed response:", res);
    
    if (!res.requestResults) {
      console.warn('Requests not found in response:', res);
      return;
    }

    setRequestResults(res.requestResults || []);
    setFriendRequestsSent(res.friendRequestsSent || []);
    setLoadingFriends(false);
  }

  const isValidStats = Array.isArray(stats) && stats.length >= 6 && stats.every(val => typeof val === 'number' && !isNaN(val));

  const isEmptyStats = stats.every(val => val === 0);

  const radarData = (isValidStats) ? [
    { label: 'Chest', value: isEmptyStats ? 1 : stats[0] },
    { label: 'Arms', value: isEmptyStats ? 1 : stats[5] },
    { label: 'Core', value: isEmptyStats ? 1 : stats[4] },
    { label: 'Stamina', value: isEmptyStats ? 1 : stats[3] },
    { label: 'Legs', value: isEmptyStats ? 1 : stats[2] },
    { label: 'Back', value: isEmptyStats ? 1 : stats[1] },
  ] : [];

  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  const handleOpenSendModal = () => {
    setIsSendModalOpen(true);
  };

  const handleCloseSendModal = () => {
    setIsSendModalOpen(false);
  };

  const handleOpenReceiveModal = () => {
    setIsReceiveModalOpen(true);
    refreshModalRequests();
  };

  const handleCloseReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const refreshUserData = async () => {
    try {
      const _ud = await AsyncStorage.getItem('user_data');
      if (_ud) {
        const userData = JSON.parse(_ud);
        setUserId(userData.userId);
      } else {
        console.warn('No user_data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving user_data from AsyncStorage:', error);
    }
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

    // AIP call to search for people
    const response = await fetch('http://powerleveling.xyz:5000/api/searchProfiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({searchText}),
    });
    
    const data = await response.json();
  
    setSearchResults(data.matchingProfiles || []);

    refresh();
  };

  const deleteFriend = async (friendUserId: string) => {
    // API 
    await fetch('http://powerleveling.xyz:5000/api/deleteFriend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendUserId }),
    });
    
  
    setFriendIds(prev => prev.filter(id => id !== parseInt(friendUserId)));

    refresh();
  };

  const sendFriendRequest = async (friendUserId: string) => {
    // API
    await fetch('http://powerleveling.xyz:5000/api/sendFriendRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendUserId }),
    });
    
  
    setFriendRequestsSent(prev => [...prev, parseInt(friendUserId)]);

    refresh();
  };

  const denyFriendRequest = async (friendUserId: Number) => {
    // API
    await fetch('http://powerleveling.xyz:5000/api/denyFriendRequest', {
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
    // API
    await fetch('http://powerleveling.xyz:5000/api/addFriend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId: userId, friendUserId: friendUserId}),
    })
    
   
    refreshModalRequests();
  }

  return (
    <ProtectedeRoute>
    <View style={{ flex: 1 }}>
      <ShrinkingHeaderWrapper
        headerTitle={displayName}
        headerSubtitle={`Power Level: ${powerLevel}`}
        headerImage={
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        }
        scrollEnabled={!isSendModalOpen}
        headerBackgroundColor={{ light: '#BA0000', dark: '#BA0000' }}
        pageBackgroundColor={{ light: '#b5b5b5', dark: '#292929' }}
      >
        <ImageBackground
          source={require('@/assets/images/dots3.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View 
            style={{
            marginTop: 9, 
            alignItems: 'center',}}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={profilePictures[profilePicture]}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={{ height: 8 }} />
            <View style={styles.chartWrapper}>
              <Svg style={styles.blackOutline} height="280" width="280" viewBox="0 0 100 100">
                <Polygon
                  points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                  fill="black"
                />
              </Svg>
              <Svg style={styles.labelBackground} height="265" width="265" viewBox="0 0 100 100">
                <Polygon
                  points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                  fill="rgb(255, 255, 255)"
                />
              </Svg>
              <View style={styles.chart}>
                <RadarChart
                  data={radarData}
                  size={245}
                  scale={1}
                  gradientColor={{
                    startColor: '#ffffff',
                    endColor: '#d1d1d1',
                    count: 6,
                  }}
                  stroke={Array(6).fill('#000000')} // # of rings out , color of rings
                  strokeWidth={Array(6).fill(1.2)} // # of rings out , thickness of rings
                  strokeOpacity={Array(6).fill(.55)}
                  labelColor="black"
                  labelDistance={1.24}
                  dataFillColor="rgb(255, 208, 0)"
                  dataFillOpacity={0.8}
                  dataStroke="black"
                  dataStrokeWidth={2}
                />
              </View>
            </View>
            <View style={styles.friendContainer}>
              <View style={styles.friendHeader}>
                <TouchableOpacity onPress={handleOpenReceiveModal} style={styles.plusButton} activeOpacity={0.4}>
                  <IconSymbol size={28} name="envelope" color="#F0F0F0" style={styles.plusButtonIcon}/>
                </TouchableOpacity>
                <Text style={styles.friendContainerText}>Friends</Text>
                <TouchableOpacity onPress={handleOpenSendModal} style={styles.plusButton} activeOpacity={0.4}>
                  <IconSymbol size={28} name="plus" color="#F0F0F0" style={styles.plusButtonIcon}/>
                </TouchableOpacity>
              </View>
              <View style={styles.friendListContainer}>
                <View style={styles.friendList}>
                  {loadingFriends ? (
                    <Text style={styles.noFriends}>Loading Friends...</Text>
                  ) : Array.isArray(friends) && friends.length > 0 ? (
                    friends.map((friend, index) => (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        key={index}
                      >
                        <Pressable
                          onPress={async () => {
                            try {
                              router.push(`/otherprofile?userIdFriend=${friend.userId}`);
                            } catch (error) {
                              console.error('Failed to set friend ID or navigate:', error);
                            }
                          }}
                          onPressIn={() => setHoveredIndex(index)}
                          onPressOut={() => setHoveredIndex(null)}
                          style={[
                            styles.friendItem,
                            hoveredIndex === index && styles.friendItemHovered,
                          ]}
                        >
                      
                        <View style={styles.friendImageWrapper}>
                          <Image
                            source={profilePictures[friend.profilePicture] || profilePictures[0]} 
                            style={styles.friendProfileImage}
                          />
                        </View>
                        <View style={styles.friendNameWrapper}>
                          <Text style={styles.friendName}>{friend.displayName}</Text>
                          <Text style={styles.friendPowerLevel}>{friend.powerlevel}</Text>
                        </View>
                        </Pressable>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noFriends}>No friends yet</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ShrinkingHeaderWrapper>

      {isSendModalOpen && ( 
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
                    <View style={styles.topModal}>
                      <Text style={styles.searchTitle}>Send Friend Request</Text>
                      <TouchableOpacity onPress={handleCloseSendModal} style={styles.xButton} activeOpacity={0.4}>
                        <IconSymbol size={28} name="x.square.fill" color="#F0F0F0" style={styles.xButtonIcon}/>
                      </TouchableOpacity>
                      <TextInput
                        value={searchText}
                        onChangeText={handleSearchChange}
                        style={styles.searchInputStyle}
                        placeholder="Search for a friend"
                        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
                      />
                      <TouchableOpacity style={styles.searchButton} onPress={searchProfiles} activeOpacity={0.5}>
                        <Text style={styles.searchButtonText}>Search</Text>
                      </TouchableOpacity>
                      <ScrollView style={styles.searchAreaSend}>
                        {searchResults.length > 0 ? (
                          searchResults.map((result, index) => {
                            const isRequestSent = friendRequestsSent.includes(Number(result.userId));
                            const isAlreadyFriend = friendIds.includes(Number(result.userId));
                            return (
                              <View
                                key={result.userId}
                                style={{
                                  marginBottom: 10,
                                  top: 4,
                                  left: 2.5,
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '55%',
                                  flexDirection: 'row',
                                }}
                              >
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  key={index}
                                >
                                  <Pressable
                                    onPress={async () => {
                                      try {
                                        router.push(`/otherprofile?userIdFriend=${result.userId}`);
                                      } catch (error) {
                                        console.error('Failed to set friend ID or navigate:', error);
                                      }
                                    }}
                                    onPressIn={() => setHoveredIndex(index)}
                                    onPressOut={() => setHoveredIndex(null)}
                                    style={[
                                      styles.modalItemSend,
                                      hoveredIndex === index && styles.friendItemHovered,
                                    ]}
                                  >
                                  <View style={styles.modalImageWrapper}>
                                    <Image
                                      source={profilePictures[result.profilePicture]}
                                      style={styles.friendProfileImage}
                                    />
                                  </View>
                                  <View style={styles.friendNameWrapper}>
                                    <Text style={styles.modalName}>{result.displayName}</Text>
                                  </View>
                                  </Pressable>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[
                                    styles.sendRequestButton,
                                    {
                                      backgroundColor: isAlreadyFriend 
                                      ? '#dc3545'
                                      : isRequestSent
                                      ? '#6c757d'
                                      : '#28a745',
                                    opacity: isRequestSent ? 0.6 : 1,
                                    },
                                  ]}
                                  activeOpacity={0.7}
                                  disabled={isRequestSent}
                                  onPress={() => {
                                  if (isAlreadyFriend) {
                                    console.log('deleted friend');
                                    setFriendToDelete(result.userId);
                                    handleOpenDeleteModal();
                                  } else if (!isRequestSent) {
                                    console.log('sent friend request');
                                    sendFriendRequest(result.userId);
                                  }
                                  }}
                                >
                                  <Text style={styles.sendRequestButtonText}>
                                    {isAlreadyFriend ? <IconSymbol size={28} name="trash" color="#F0F0F0" style={styles.xButtonIcon}/> : isRequestSent ? 'Sent' : <IconSymbol size={28} name="paperplane.fill" color="#F0F0F0" style={styles.xButtonIcon}/>}
                                  </Text>
                                </TouchableOpacity>

                              </View>
                            )
                          })
                        ) : (
                          <Text style={styles.searchComment1}>No results found.</Text>
                        )}
                      </ScrollView>
                    </View>
                </View>
              </View>
            )}

            {isDeleteModalOpen && ( 
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.topModal}>
                      <Text style={styles.deleteTitle}>Delete Freind?</Text>
                      <TouchableOpacity onPress={handleCloseDeleteModal} style={styles.xButton2} activeOpacity={0.4}>
                        <IconSymbol size={28} name="x.square.fill" color="#F0F0F0" style={styles.xButtonIcon}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { if (friendToDelete !== null) {{deleteFriend(friendToDelete); handleCloseDeleteModal();}}}} style={styles.xButton3} activeOpacity={0.4}>
                        <IconSymbol size={28} name="checkmark" color="#F0F0F0" style={styles.xButtonIcon}/>
                      </TouchableOpacity>
                    </View>
                </View>
              </View>
            )}

      {isReceiveModalOpen && ( 
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
                    <View style={styles.topModal}>
                      <Text style={styles.searchTitle}>Friend Request</Text>
                      <TouchableOpacity onPress={handleCloseReceiveModal} style={styles.xButton} activeOpacity={0.4}>
                        <IconSymbol size={28} name="x.square.fill" color="#F0F0F0" style={styles.xButtonIcon}/>
                      </TouchableOpacity>
                      <ScrollView style={styles.searchAreaReceive}>
                        {requestResults.length > 0 ? (
                          requestResults.map((result, index) => {
                            return (
                              <View
                                key={result.userId}
                                style={{
                                  marginBottom: 10,
                                  top: 4,
                                  left: 2.5,
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '40%',
                                  flexDirection: 'row',
                                }}
                              >
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  key={index}
                                >
                                  <Pressable
                                    onPress={async () => {
                                      try {
                                        router.push(`/otherprofile?userIdFriend=${result.userId}`);
                                      } catch (error) {
                                        console.error('Failed to set friend ID or navigate:', error);
                                      }
                                    }}
                                    onPressIn={() => setHoveredIndex(index)}
                                    onPressOut={() => setHoveredIndex(null)}
                                    style={[
                                      styles.modalItemReceive,
                                      hoveredIndex === index && styles.friendItemHovered,
                                    ]}
                                  >
                                  <View style={styles.modalImageWrapper}>
                                    <Image
                                      source={profilePictures[result.profilePicture]}
                                      style={styles.friendProfileImage}
                                    />
                                  </View>
                                  <View style={styles.friendNameWrapper}>
                                    <Text style={styles.modalName}>{result.displayName}</Text>
                                  </View>
                                  </Pressable>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[
                                    styles.sendRequestButton,
                                    {backgroundColor: '#28a745'},
                                  ]}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                    acceptFriendRequest(result.userId);
                                    denyFriendRequest(result.userId);
                                  }}
                                >
                                  <Text style={styles.receiveRequestButtonText}>
                                    <IconSymbol size={28} name="checkmark" color="#F0F0F0" style={styles.xButtonIcon}/>
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[
                                    styles.sendRequestButton,
                                    {backgroundColor: '#dc3545'},
                                  ]}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                    denyFriendRequest(result.userId);
                                  }}
                                >
                                  <Text style={styles.receiveRequestButtonText}>
                                    <IconSymbol size={28} name="trash" color="#F0F0F0" style={styles.xButtonIcon}/>
                                  </Text>
                                </TouchableOpacity>

                              </View>
                            )
                          })
                        ) : (
                          <Text style={styles.searchComment2}>No requests found.</Text>
                        )}

                      </ScrollView>
                      
                    </View>
                </View>
              </View>
            )}    
    </View>
    </ProtectedeRoute>
  );
}

const styles = StyleSheet.create({


  // Background
  backgroundImage: {
    justifyContent: 'flex-start',
    width: '100%',
    height: '80%'
  },

  // Image
  imageWrapper: {
    width: 240,
    height: 240,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'black',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  // chart
  chartWrapper: {
    //marginTop: -200, // to match the profilepic
    width: 240,
    height: 280,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },

  chart: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  //white outline  
  labelBackground: {
    position: 'absolute',
    zIndex: -2,
  },

  //black Outline outline
  blackOutline: {
    position: 'absolute',
    zIndex: -3,
  },


  // Friend List/Box
  friendContainer: {
    marginTop: 9,
    padding: 5,
    paddingBottom: 20,
    marginBottom: 40,
    backgroundColor: 'white',
    width: '95%',
    height: 'auto',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },

  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes text left and button right
    width: '100%',
    marginBottom: 5
  },

  friendContainerText: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 50,
    letterSpacing: 1,
    lineHeight: 50,
    marginLeft: 0,
    marginTop: 14,
  },

  plusButton: {
    backgroundColor: '#BA0000',
    marginRight: 10,
    marginLeft: 10,
    width: 45,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
    
  plusButtonIcon: {
    marginLeft: 0,
    marginTop: 2,
  },

  friendListContainer: {
    height: 'auto',
    width: '94%',
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  friendList: {
    paddingLeft: '2%',
    paddingRight: '2%',
    color: 'black',
    marginTop: 10,
    width: '100%',
  },

  friendItem: {
    backgroundColor: 'rgb(255, 255, 255)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    fontSize: 20,
    cursor: 'pointer',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },

  friendItemHovered: {
    backgroundColor: 'rgb(230, 230, 230)',
  },

  friendImageWrapper: {
    marginRight: 0,
    width: 50,
    height: 50,
    borderRadius: '50%', // makes circle cutout
    overflow: 'hidden',
  },

  friendProfileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  friendNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  friendName: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginLeft: 10,
  },
    
  friendPowerLevel: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 20,
    color: '#666',
    marginRight: 50,
    //marginLeft: 'auto',
  },

  noFriends: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginTop: 0,
    marginBottom: 15,
  },

  modalOverlay: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 7,
    borderWidth: 5,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    top: 15,
    width: 350,
    height: 550,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },

  topModal: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 5,
    borderRadius: 6,
    borderColor: 'rgba(255, 255, 255, 0.43)',
  },

  xButton: {
    position: 'absolute',
    left: '2%',
    top: '2%',
    backgroundColor: '#BA0000',
    marginRight: 100,
    width: 45,
    height: 45,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
    
  xButtonIcon: {
  },

  searchTitle: {
    fontFamily: 'MicrogrammaEB',
    position: 'absolute',
    color: '#000',
    fontSize: 21,
    top: 25,
    right: 10
  },

  searchInputStyle: {
    position: 'absolute',
    width: '60%',
    height: '10%',
    left: '3%',
    top: '14%',
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: 'rgb(48,48, 48)',
    color: 'white',
    fontFamily: 'MicrogrammaEB',
    fontSize: 15,
  },

  searchButton: {
    position: 'absolute',
    backgroundColor: '#28a745',
    left: '67%',
    top: '14.5%',
    color: 'white',
    padding: 10,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.18)',
  },

  searchButtonText: {
    fontFamily: 'MicrogrammaEB',
    color: 'white',
    fontSize: 18,
    top: 1,
  },

  searchAreaSend: {
    position: 'absolute',
    height: '70%',
    width: '93%',
    left: '3%',
    top: '28%',
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },

  searchAreaReceive: {
    position: 'absolute',
    height: '83%',
    width: '93%',
    left: '3%',
    top: '14%',
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },

  searchComment1: {
    fontFamily: 'MicrogrammaEB',
    position: 'absolute',
    color: 'rgb(48, 48, 48)',
    fontSize: 25,
    left: '9%',
    top: 170,
  },

  modalItemSend: {
    backgroundColor: 'rgb(255, 255, 255)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 0,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },

  modalImageWrapper: {
    marginRight: 0,
    width: 50,
    height: 50,
    borderRadius: '50%', // makes circle cutout
    overflow: 'hidden',
  },

  modalName: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginLeft: 10,
    width: '70%'
  },

  modalItemReceive: {
    backgroundColor: 'rgb(255, 255, 255)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 0,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },

  sendRequestButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: 15,
    marginRight: 0,
    cursor: 'pointer',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.27)',
    marginLeft: 7,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 8,
    width: '44%',
    height: '84%',
    alignItems: 'center'
    
  },

  sendRequestButtonText: {
    width: '140%',
    top: 1,
    fontFamily: 'MicrogrammaEB',
    color: 'white',
    fontSize: 10,
    left: 10,
  },

  searchComment2: {
    fontFamily: 'MicrogrammaEB',
    position: 'absolute',
    color: 'rgb(48, 48, 48)',
    fontSize: 22,
    left: '10%',
    top: 170,
  },

  receiveRequestButtonText: {
    width: '140%',
    top: -1,
    fontFamily: 'MicrogrammaEB',
    color: 'white',
    fontSize: 10,
    left: 0,
  },

  // delete confirm

  deleteTitle: {
    fontFamily: 'MicrogrammaEB',
    position: 'absolute',
    color: '#000',
    fontSize: 30,
    top: 150,
    right: 28
  },

  xButton2: {
    position: 'absolute',
    left: '20%',
    top: '50%',
    backgroundColor: '#BA0000',
    marginRight: 100,
    width: 60,
    height: 60,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  xButton3: {
    position: 'absolute',
    right: '-10%',
    top: '50%',
    backgroundColor: '#28a745',
    marginRight: 100,
    width: 60,
    height: 60,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default ProfilePage;