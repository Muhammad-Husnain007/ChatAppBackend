import React, { useState, useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screens/splash/Splash';
import AgreeandContinue from '../screens/verfication/AgreeandContinue';
import EnterNumber from '../screens/verfication/EnterNumber';
import EnterOtp from '../screens/verfication/EnterOtp';
import BottomNavigation from './BottomNavigation';
import OpenChatUser from '../screens/tabs/openChat/OpenChatUser';
import OpenSetting from '../screens/tabs/setting/OpenSetting';
import OpenAbout from '../screens/tabs/setting/OpenAbout';
import AddContacts from '../screens/tabs/addContacts/AddContacts';
import AppLock from '../screens/tabs/appLock/AppLock';
import OpenChat from '../screens/tabs/openChat/OpenChat';
import { AppState, ActivityIndicator, View } from 'react-native';
import axios from 'axios';
import { API } from '../api/Api';
import OpenFile from '../screens/tabs/openChat/OpenFile';
import ViewStatus from '../screens/tabs/home/updates/ViewStatus';
import ViewProfile from '../screens/tabs/setting/ViewProfile';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [initialRoute, setInitialRoute] = useState<null | string>(null); 

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isToken = await AsyncStorage.getItem('AuthToken');
        console.log("Token hai bhai", isToken)

        if (isToken) {
          const response = await axios.post(`${API.BASE_URI}/user/verifyToken`, {
            token: isToken,
          });
        console.log("yeh response verify token ka", response.data.valid)
          if (response.data.valid === true) {
            console.log("Token is valid:", response.data);
            setInitialRoute("Splash"); 
          } else {
            await AsyncStorage.removeItem("AuthToken");
            await AsyncStorage.removeItem("UserId");
            setInitialRoute("AgreeContinue");
          }
        } else {
          await AsyncStorage.removeItem("AuthToken");
          await AsyncStorage.removeItem("UserId");
          setInitialRoute("AgreeContinue");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setInitialRoute("AgreeContinue");
      }
    };
  
    checkToken(); 
  }, []);
  

  console.log('Initial Route:', initialRoute);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="AgreeContinue" component={AgreeandContinue} />
      <Stack.Screen name="EnterNumber" component={EnterNumber} />
      <Stack.Screen name="EnterOtp" component={EnterOtp} />
      <Stack.Screen name="OpenChat" component={OpenChat} />
      <Stack.Screen name="OpenChatUser" component={OpenChatUser} />
      <Stack.Screen name="OpenSetting" component={OpenSetting} />
      <Stack.Screen name="OpenAbout" component={OpenAbout} />
      <Stack.Screen name="AddContact" component={AddContacts} />
      <Stack.Screen name="OpenFile" component={OpenFile} />
      <Stack.Screen name="AppLock" component={AppLock} />
      <Stack.Screen name="BottomScreens" component={BottomNavigation} />
      <Stack.Screen name="ViewStatus" component={ViewStatus} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
