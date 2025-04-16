import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, Pressable, ScrollView} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ShrinkingHeaderWrapper from '@/components/ShrinkingHeaderWrapper';
const profileImage = require('@/assets/images/profile.png');
import { router, useLocalSearchParams } from 'expo-router';
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
  const [powerLevel, setPowerLevel] = useState(0);
  const [stats, setStats] = useState<number[]>([]);
  const [friends, setFriends] = useState<{profilePicture: number; displayName: string; profileImage: string; powerlevel: number; userId: number}[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredIndexModal, setHoveredIndexModal] = useState<number | null>(null);
  const [displayName, setDisplay] = useState<string>('');
  const [requestResults, setRequestResults] = useState<{ displayName: string; profileImage: string; userId: number}[]>([]);
  const { userIdFriend } = useLocalSearchParams();
  const [userId, setUserId] = useState<number | null>(null);
  const [profilePicture, setProfilePicture] = useState<number>(0);

  useEffect(() => {
    if (typeof userIdFriend === 'string') {
      const parsed = parseInt(userIdFriend, 10);
      if (!isNaN(parsed)) {
        setUserId(parsed);
      } else {
        console.warn('Invalid userIdFriend:', userIdFriend);
      }
    }  
  }, [userIdFriend]);

  console.log('Navigated to OtherProfile with userId:', userIdFriend);

  // Async Local User ID Call Not Needed since passed in
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

    const response = await fetch('http://powerleveling.xyz:5000/api/getProfile', {
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
    setLoadingFriends(false);
  }

  const isValidStats = Array.isArray(stats) && stats.length >= 6 && stats.every(val => typeof val === 'number' && !isNaN(val));
  const isEmptyStats = stats.every(val => val === 0);

  const radarData = (isValidStats && !isEmptyStats) ? [
    { label: 'Chest', value: stats[0] },
    { label: 'Arms', value: stats[5] },
    { label: 'Core', value: stats[4] },
    { label: 'Stamina', value: stats[3] },
    { label: 'Legs', value: stats[2] },
    { label: 'Back', value: stats[1] },
  ] : [];

  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

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
                  stroke={Array(6).fill('#000000')} // color of rings
                  strokeWidth={Array(6).fill(1.2)} // thickness of rings
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
                <Text style={styles.friendContainerText}>Friends</Text>
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
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5
  },

  friendContainerText: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 50,
    letterSpacing: 1,
    lineHeight: 50,
    marginLeft: 70,
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
    borderRadius: '50%',
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

});

export default ProfilePage;