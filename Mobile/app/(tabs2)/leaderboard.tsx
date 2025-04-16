import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, FlatList, ActivityIndicatorBase, ActivityIndicator} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ProtectedeRoute from '@/components/protectedRoute';

const Leaderboard: React.FC = () => {

    const [isGlobal, setIsGlobal] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const scrollAreaRef = useRef<FlatList>(null);

    /*
    const staticFriendLeaderboard = [
        { id: '1', name: 'Friend 1', score: 1000 },
        { id: '2', name: 'Friend 2', score: 900 },
        { id: '3', name: 'Friend 3', score: 850 },
        { id: '4', name: 'Friend 4', score: 800 },
        { id: '5', name: 'Friend 5', score: 750 },
    ];
    const staticGlobalLeaderboard = [
      { id: '1', name: 'Player 1', score: 1000 },
      { id: '2', name: 'Player 2', score: 900 },
      { id: '3', name: 'Player 3', score: 850 },
      { id: '4', name: 'Player 4', score: 800 },
      { id: '5', name: 'Player 5', score: 750 },
    ];
    */


    const [userId, setUserId] = useState<string>('');
    const [userData, setUserData] = useState<any>(null);

    const [powerLevel, setPowerLevel] = useState(0);
    const [TopPowerLevels, SetTopPowerLevels] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const isUserRow = (entry: any) => entry.userId === userId;
    const [displayName, setDisplay] = useState<string>('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userRank, setUserRank] = useState(0);
    const [friendsLoaded, setFriendsLoaded] = useState(false);

    //get user data 
    useEffect(() => {
      const getUserData = async () => {
        try {
          const _ud = await AsyncStorage.getItem('user_data');
          if (_ud) {
            const data = JSON.parse(_ud);
            setUserId(data.userId);
            setUserData(data);
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      };
      getUserData();
    },[]);

    // get Profile
    useEffect(() => {
      if (!userId) return;
      async function getProfile(): Promise<void> {
        
    // API profile info Call
    try {
      const obj = { userId: userId };
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

      setDisplay(res.profile.displayName);
      setPowerLevel(res.profile.powerlevel);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
  
      getProfile();
    }, [userId]);
  
    // search freinds
    useEffect(() => {
      if (!isGlobal && !friendsLoaded && userId && userData && displayName && powerLevel !== null) {
        async function searchFriends(): Promise<void> {

          'api/searchFriends'
          try {
            const response = await fetch('http://powerleveling.xyz:5000/api/searchFriends', {
              method: 'POST',
              body: JSON.stringify({ userId, page }),
              headers: { 'Content-Type': 'application/json' },
            });
    
            const text = await response.text();
            if (!text) {
              console.error("Empty response from searchFriends");
              return;
            }
    
            const res = JSON.parse(text);
    
            const userFriend = {
              userId: userData.userId,
              displayName: displayName,
              powerlevel: powerLevel,
            };
    
            const updatedFriends = [userFriend, ...res.friendResults];
            setFriends(updatedFriends);
            setFriendsLoaded(true);
          } catch (err) {
            console.error("Failed to fetch friends:", err);
          }
        }
    
        searchFriends();
      }
    }, [isGlobal, friendsLoaded, userId, userData, displayName, powerLevel]);
    
  
  
    useEffect(() => {
      const resetAndFetch = async () => {
        setPage(1);
        setHasMore(true);
        if (isGlobal) {
          SetTopPowerLevels([]);
        } else {
          if (!friendsLoaded) {
            setFriends([]);
          }
        }
  
        setTimeout(() => {
          fetchData(1);
        }, 0);
      };
  
      resetAndFetch();
    }, [isGlobal]);
    
    // lazy fetch leaderboard / updatet fetch 
    const fetchData = async (fetchPage = page) => {
      if (!userId || loading || !hasMore) return;
      if (loading || !hasMore) return;
      setLoading(true);
    
      const endpoint = isGlobal ? '/api/getTopPowerlevels' : '/api/getTopFriendPowerLevels';
    
      try {
        console.log(`[fetchData] Fetching from endpoint: ${endpoint}`);
        console.log(`[fetchData] Payload:`, { userId, page: fetchPage });
    
        const response = await fetch(`http://powerleveling.xyz:5000${endpoint}`, {
          method: 'POST',
          body: JSON.stringify({ userId, page }),
          headers: { 'Content-Type': 'application/json' },
        });
    
        const text = await response.text();
        console.log('[fetchData] Raw response text:', text);
    
        if (!text) {
          console.error('[fetchData] Empty response from server');
          return;
        }
    
        let res;
        try {
          res = JSON.parse(text);
        } catch (jsonErr) {
          console.error('[fetchData] Failed to parse JSON:', jsonErr);
          console.error('[fetchData] Offending text:', text);
          return;
        }
    
        console.log('[fetchData] Parsed response:', res);
    
        if (res.error) {
          console.error('[fetchData] API error:', res.error);
          return;
        }
    
        if (!res.topProfiles) {
          console.warn('[fetchData] No topProfiles found in response');
          return;
        }
    
        const newProfiles = res.topProfiles.map((profile: any, index: number) => ({
          ...profile,
          rank: (fetchPage - 1) * 10 + index + 1,
        }));
    
        if (isGlobal) {
          SetTopPowerLevels(prev => fetchPage === 1 ? newProfiles : [...prev, ...newProfiles]);
          setUserRank(res.userRank ?? 0);
        } else {
          setFriends(prev => fetchPage === 1 ? newProfiles : [...prev, ...newProfiles]);
        }
    
        setHasMore(newProfiles.length === 10);
        setPage(fetchPage + 1);
      } catch (err) {
        console.error('[fetchData] Network or logic error:', err);
      } finally {
        setLoading(false);
      }
    };
    

    const currentData = isGlobal ? TopPowerLevels : friends;
  
    useEffect(() => {
      fetchData();
    }, [userId, isGlobal]);
  
  
    const handleTabChange = (global: boolean) => {
      console.log("Switching leaderboard to:", global ? "Global" : "Friends");
      setTimeout(() => {
        setIsGlobal(global);
        setPage(1);          
  setHasMore(true);
  setLoading(false);   
  fetchData(1);
      }, 300);
    };
    
    const renderCurrentItem = ({ item, index } : { item: any; index: number }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
        <Text style={styles.nameText}>{item.displayName}</Text>
        <Text style={styles.powerLevelText}>{item.powerlevel}</Text>
      </View>
    );

    return (
      <ProtectedeRoute>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Text style={styles.headerText}>LEADERBOARD</Text>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.image}
          />
        </ThemedView>

        <ImageBackground
          source={require("@/assets/images/dots3.png")}
          style={styles.background}
          resizeMode='cover'
        >
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, isGlobal ? styles.active : styles.inactive, {width:'55%'}, !isGlobal ? {borderColor: '#ba0000'} : {borderColor: '#ffffff'}]}
              onPress={() => handleTabChange(true)}
            >
              <Text style={isGlobal ? styles.activeText : styles.inactiveText}>Global</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, !isGlobal ? styles.active : styles.inactive,{width:'55%'}, isGlobal ? {borderColor: '#ba0000'} : {borderColor: '#ffffff'}]}
              onPress={() => handleTabChange(false)}
            >
              <Text style={!isGlobal ? styles.activeText : styles.inactiveText}>Friends</Text>
            </TouchableOpacity>
          </View>

          <ThemedView style={styles.leaderboardContainer}>
            {/*scroll here*/}
            <ThemedView style={styles.leaderboardHeader}>
              <ThemedText style={styles.leaderboardHeaderText}>#</ThemedText>
              <ThemedText style={styles.leaderboardHeaderText}>Username</ThemedText>
              <ThemedText style={styles.leaderboardHeaderText}>Power Level</ThemedText>
            </ThemedView>

            {/*global leaderboard*/}
            {/*friends leaderboard*/}

            
            <FlatList
              //data={isGlobal ? TopPowerLevels.sort((a, b) => b.powerlevel - a.powerlevel) : friends.sort((a, b) => b.powerlevel - a.powerlevel)}
              data = {currentData}
              //keyExtractor={(item, index) => item.userId || index.toString()}
              renderItem={renderCurrentItem}
              keyExtractor={(item, index) => (item.userId ? item.userId.toString() : index.toString())}
              onEndReached={() => fetchData()}
              onEndReachedThreshold={0.5}
              style={{ backgroundColor: '#f0f0f0' }}
            />

            <ThemedView style={styles.leaderboardbottom}>

            </ThemedView>

          </ThemedView>
        </ImageBackground>
      </ThemedView>
      </ProtectedeRoute>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ba0000', //red
      height: '13%',
      width: '100%',
      borderBottomWidth: 5,
      borderBottomColor: '#000000', //black
    },
    headerText:{
      fontFamily: 'MicrogrammaEB',
      top: 30,
      fontSize: 24,
      padding: 20,
      color: "white"
    },
    image:{
      top: 20,
      resizeMode: 'contain',
      height: '50%',
      width: '25%',
    },
    background:{
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    tabContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 30,
      width: '50%',
      marginRight: 35,
    },
    tabText:{
      color: '#ffffff',  //white
      fontWeight: 'bold',
      fontSize: 5,
    },
    tabButton:{
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderRadius: 5,
      padding: 20,
      marginRight: 20
    },
    active:{
      backgroundColor: '#ba0000',
    },
    inactive:{
      backgroundColor: '#ffffff',
    },
    activeText:{
      color: '#ffffff', 
      fontWeight: 'bold',
      fontFamily: 'MicrogrammaEB',
    },
    inactiveText:{
      color: '#ba0000',  
      fontWeight: 'bold',
      fontFamily: 'MicrogrammaEB',
    },
    leaderboardContainer:{
      left: '1%',
      width: '80%',
      height: '65%',
      borderRadius: 5,
    },
    leaderboardHeader:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      overflow: 'hidden',
      height: '10%',
      backgroundColor: '#ffb202',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderColor: '#000000'
    },

    leaderboardbottom:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      overflow: 'hidden',
      height: '5%',
      backgroundColor: '#ffb202',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderColor: '#000000'
    },
    leaderboardHeaderText:{
      color: '#ffffff',
    },

    itemContainer:{
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
    },
    rankText:{
      flex:1,
      left: 15,
      fontFamily: 'MicrogrammaEB',
      fontSize: 16,
    },
    nameText:{
      flex:2.5,
      right: 5,
      fontFamily: 'MicrogrammaEB',
      fontSize: 16,
    },
    powerLevelText:{
      flex:1,
      fontFamily: 'MicrogrammaEB',
      fontSize: 16,
    },

  });
  
  export default Leaderboard;