import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ProtectedeRoute from '@/components/protectedRoute';

const LogOut: React.FC = () => {
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          setDisplayName(user.displayName);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();
  }, []);

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
      <ProtectedeRoute>
      <ParallaxScrollView
      headerBackgroundColor={{ light: '#BA0000', dark: '#BA0000' }}
      headerImage={<View style={styles.container2}>
        <ImageBackground
          source={require('@/assets/images/BackGroundVert.png')}
          style={styles.backgroundImage}
        >
          <Image
            source={require('@/assets/images/PLLogo.png')}
            style={styles.image} />
        </ImageBackground>
      </View>}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">LOGOUT</ThemedText>
      </ThemedView>

      <ThemedText type='subtitle'>See you Later!</ThemedText>
      <View style={styles.formContainer}>

        <TouchableOpacity style={styles.button} onPress={doLogout}>
            <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>

      </View>
    </ParallaxScrollView>
    </ProtectedeRoute>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    width: '100%',
  },
  container2: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 45,
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  formContainer: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 20,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'white',
    fontFamily:'PuristaSemiBI',
    backgroundColor: '#151718',
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center', 
  },
  bottomImage: {
    width: 200, 
    height: 200,
    resizeMode: 'contain',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#FFB202', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, 
    borderWidth: 3,
    borderColor: '#Black'
  },
  buttonText: {
    color: 'Black', 
    fontFamily:'PuristaBI',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
  },
});

export default LogOut;