import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ProtectedeRoute from '@/components/protectedRoute';

const Verify: React.FC = () => {

  // Hooks
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const app_name = 'powerleveling.xyz';
  function buildPath(route:string) : string
  {
    if (process.env.NODE_ENV != 'development')
    {
    return 'http://' + app_name + ':5000/' + route;
    }
    else
    {
      //return 'http://localhost:5000/' + route;
      return 'http://' + app_name + ':5000/' + route;
    }
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.userId);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();
  }, []);


  const doVerify = async (event:any) => {
    event.preventDefault();
    var obj = {userId:userId,verificationCode:verificationCode};
    var js = JSON.stringify(obj);
    try
    {
        //Get the API response
        const response = await fetch(buildPath('api/verifyEmail'),
        {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
        var res = JSON.parse(await response.text());

        if( res.error != "" )
        {
            setMessage(res.error);
        }
        else
        {
            router.replace('/dashboard');
        }
    }
    catch(error:any)
    {
        alert(error.toString());
        return;
    }
};

  return (


<ProtectedeRoute>
<KeyboardAvoidingView
      style={styles.container1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: 'red', dark: 'red' }}
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
        <ThemedText type="title">VERIFY EMAIL</ThemedText>
      </ThemedView>
      
      <ThemedText type="subtitle">Check your E-mail for the Code</ThemedText>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          placeholderTextColor="rgba(255, 255, 255, .7)"
          value={verificationCode}
          onChangeText={setVerificationCode} />

        <TouchableOpacity style={styles.button} onPress={doVerify}>
            <Text style={styles.buttonText}>VERIFY</Text>
        </TouchableOpacity>

          </View>
        </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    <View style={styles.bottomImageContainer}>
        <Image
          source={require('@/assets/images/BuffMan.png')}
          style={styles.bottomImage} />
      </View>
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
    bottom: Platform.select({
      ios: -10,
      android: -10,
    }),
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
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
  },
});

export default Verify;