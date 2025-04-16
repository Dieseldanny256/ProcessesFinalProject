

import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register: React.FC = () => {
  
  // Hooks
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);

  const app_name = 'powerleveling.xyz';

  function buildPath(route:string) : string
  {
      if (process.env.NODE_ENV != 'development')
      {
      return 'http://' + app_name + ':5000/' + route;
      }
      else
      {
        return 'http://' + app_name + ':5000/' + route;
      }
  }

  // Handle Register
  async function doRegister(event:any) : Promise<void>
  {
      event.preventDefault();
      var obj = {login:login,password:password,displayName:displayName,email:email};
      var js = JSON.stringify(obj);
      try
      {

        console.log("Sending request to:", buildPath('api/register'));
        console.log("Request payload:", js);

          //Get the API response

          const response = await fetch(buildPath('api/register'),
          {method:'POST',body:js,headers:{'Content-Type':'application/json'}});

          console.log("Raw response:", response);
          
          var res = JSON.parse(await response.text());

          console.log("Parsed response:", res);

          if( res.error != "" )
          {
              setMessage(res.error);
          }
          else
          {
            var user = res.userDetails;
            AsyncStorage.setItem('user_data', JSON.stringify(user));
            setMessage('');
            router.push('/verify')
          }
      }
      catch(error:any)
      {
          console.error("Error occurred:", error);
          alert(error.toString());
          return;
      }
  };

    const isPasswordComplex = (password: string) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };

  return (
    <KeyboardAvoidingView
      style={styles.container1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: '#BA0000', dark: '#BA0000' }}
            headerImage={
              <View style={styles.container2}>
                <ImageBackground
                  source={require('@/assets/images/BackGroundVert.png')}
                  style={styles.backgroundImage}
                >
                  <Image
                    source={require('@/assets/images/PLLogo.png')}
                    style={styles.image}
                  />
                </ImageBackground>
              </View>
            }
          >
            <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">REGISTER</ThemedText>
      </ThemedView>

      <ThemedText type="subtitle">You Ready to Get Fit?</ThemedText>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, .7)"
          value={login}
          onChangeText={(text) => setLogin(text)}
          
          />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, .7)"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Display Name"
          placeholderTextColor="rgba(255, 255, 255, .7)"
          value={displayName}
          onChangeText={(text) => setDisplayName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, .7)"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordValid(isPasswordComplex(text));
          }}
          secureTextEntry
        />

        {!passwordValid && password.length > 0 && (
          <Text style={{ color: 'red', marginTop: 4, fontSize: 12 }}>
            8 characters, a number, an uppercase letter, and a special character are Required
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={doRegister} activeOpacity={0.5}>
            <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
            
            </View>
          </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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

export default Register;