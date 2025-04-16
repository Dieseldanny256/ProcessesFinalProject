import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login: React.FC = () => {
  
  const [message,setMessage] = React.useState('');
  const [loginName,setLoginName] = React.useState('');
  const [loginPassword,setPassword] = React.useState('');
  const [loginError, setLoginError] = useState('');
  
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

  // Handle Login
  async function doLogin(event:any) : Promise<void>
  {
      event.preventDefault();
      var obj = {login:loginName,password:loginPassword};
      var js = JSON.stringify(obj);

      try {

      console.log("Sending request to:", buildPath('api/login'));
      console.log("Request payload:", js);

          //Get the API response
          const response = await fetch(buildPath('api/login'),
          {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
          console.log("Raw response:", response);

          var res = JSON.parse(await response.text());
          
          console.log("Parsed response:", res);

          if( res.error != "" )
          {
              setMessage('Invalid credentials');
              setLoginError('Incorrect username or password.');
          }
          else
          {
              var user = res.userDetails;
              AsyncStorage.setItem('user_data', JSON.stringify(user));
              setMessage('');
              setLoginError('');

              if (user.isVerified) {
                router.push("/dashboard");
              } else {
                router.push("/verify");
              }
          }
      }
      catch(error:any)
      {
          console.error("Error occurred:", error);
          alert(error.toString());
          return;
      }
  };
      
  function handleSetLoginName(text: string): void {
    setLoginName(text);
  }
  
  function handleSetPassword(text: string): void {
    setPassword(text);
  }
  

  return (

    <><KeyboardAvoidingView
      style={styles.container1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <ThemedText type="title">LOGIN</ThemedText>
          </ThemedView>

          <ThemedText type="subtitle">You Ready to Get Fit?</ThemedText>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255, 255, 255, .7)"
              value={loginName}
              onChangeText={handleSetLoginName} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, .7)"
              value={loginPassword}
              onChangeText={handleSetPassword}
              secureTextEntry
            />

            {loginError !== '' && (
              <Text style={{ color: 'red', marginTop: 10, fontSize: 14 }}>
                {loginError}
              </Text>
            )}

            <TouchableOpacity style={styles.button} onPress={doLogin} activeOpacity={0.5}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

          </View>
        </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
      <View style={styles.bottomImageContainer}>
        <Image
          source={require('@/assets/images/BuffMan.png')}
          style={styles.bottomImage} />
      </View></>
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
      ios: 70,
      android: -10,
    }),
    left: 0,
    right: 0,
    alignItems: 'center', 
  },
  bottomImage: {
    width: 200, 
    height: 180,
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

export default Login;