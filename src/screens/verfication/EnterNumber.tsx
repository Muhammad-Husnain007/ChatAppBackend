import React, { useRef, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, View, Text, TextInput, StyleSheet, Platform, Alert, Modal, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../utils/ResponsiveNess';
import { COLORS } from '../../utils/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { IMAGES_URI } from '../../constants/Images';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { API } from '../../api/Api';
import ScreensNavbar from '../../components/ScreensNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterNumber = ({ navigation }: any) => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [otpConfirmation, setOtpConfirmation] = useState<any>(null);
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleNext = async () => {
    if (!userName || !phoneNumber) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    try {
      const registerUser:any = await axios.post(`${API.BASE_URI}/user/register`, {
        name: userName,
        phoneNumber,
      });
  
      console.log('register userId:', registerUser.data.data.user._id)
      const userId = registerUser.data.data.user._id; 
      const accessToken = await axios.get(`${API.BASE_URI}/user/getAccessToken/${userId}`)
      console.log('New access Token',accessToken.data.data.accessToken)
      const storeToken = accessToken.data.data.accessToken
      await AsyncStorage.setItem('AuthToken', storeToken)
      await AsyncStorage.setItem('UserId', userId)
     
      const signIn = await auth().signInWithPhoneNumber(phoneNumber);
      setOtpConfirmation(signIn);
      setConfirmation(true);
    } catch (error) {
      console.error('Error:', error);
    } 
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    if (value && index < otpArray.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    setOtpArray(newOtpArray);
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && otpArray[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otpArray.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }

    try {
      await otpConfirmation.confirm(code);
      navigation.navigate('BottomScreens');
    } catch (error) {
      console.error('Error confirming code:', error);
      Alert.alert('Verification Failed', 'Invalid or expired OTP.');
    } finally {
    }
  };

  return (
    confirmation ?
      <>
        <ScreensNavbar text="Verify your phone number" />

        <View style={{ flex: 1, alignItems: 'center', paddingVertical: getResponsiveHeight(20), backgroundColor: COLORS.white }}>
          {/* OTP Inputs */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            {otpArray.map((digit, index) => (
              <TextInput
                key={index}
                style={{ width: getResponsiveWidth(10), borderColor: COLORS.primary, borderBottomWidth: 2, paddingLeft: getResponsiveWidth(4) }}
                onChangeText={(value: string) => {
                  handleOtpChange(index, value);
                  if (value === '' && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                value={digit}
                keyboardType="number-pad"
                onKeyPress={({ nativeEvent }: any) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>

          {/* Resend Option */}
          <TouchableOpacity onPress={() => { }} activeOpacity={0.7}>
            <Text style={{ top: getResponsiveHeight(5), color: 'blue', fontSize: getResponsiveFontSize(14) }}>Resend code?</Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <CustomButton
            text="Verify"
            extraStyle={{ width: '50%', backgroundColor: COLORS.primary, position: 'absolute', bottom: getResponsiveHeight(5) }}
            textStyle={{ fontSize: getResponsiveFontSize(18) }}
            onPress={handleVerify}
            showLoader={true}
          />
        </View>
      </>
      :
      <ImageBackground
        source={IMAGES_URI.background}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        imageStyle={{ opacity: 0.2, resizeMode: 'stretch', backgroundColor: 'black', }}
      >
        {/* Overlay for image opacity */}
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.white }} />

        {/* Content container */}
        <View
          style={{
            width: '100%',
            height: '100%',
            zIndex: 1,
            alignItems: 'center',
            paddingVertical: getResponsiveHeight(10),
          }}
        >
          <Text
            style={{
              fontSize: getResponsiveFontSize(20),
              color: COLORS.primary,
            }}
          >
            Verify your Account
          </Text>

          <View
            style={{
              gap: 30,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: getResponsiveHeight(10),
            }}
          >
            <CustomInput
              placeholder="Enter your name"
              inputStyle={{
                paddingHorizontal: 20,
                fontSize: getResponsiveFontSize(14),
              }}
              value={userName}
              onChange={(name) => setUserName(name)}
            />
            <CustomInput
              placeholder="Enter your number"
              inputStyle={{
                paddingHorizontal: 20,
                fontSize: getResponsiveFontSize(14),
              }}
              onChange={(number) => setPhoneNumber(number)}
              value={phoneNumber}
              keyboardType='number-pad'
            />
          </View>

          <CustomButton
            text="Next"
            onPress={handleNext}
            showLoader={true}
            extraStyle={{
              backgroundColor: COLORS.primary,
              position: 'absolute',
              bottom: getResponsiveHeight(5),
            }}
          />
        </View>
      </ImageBackground>

  );
};

export default EnterNumber;
