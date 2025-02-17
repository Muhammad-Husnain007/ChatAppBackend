import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../utils/Colors'
import ReactNativeBiometrics from 'react-native-biometrics';

const Splash = ({navigation}: any) => {

  const biometricVerification = async() => {
    const rnBiometric = new ReactNativeBiometrics();
    rnBiometric.simplePrompt({
      cancelButtonText: 'Cancel',
      promptMessage: 'Confirm biometric',
    })
      .then((result) => {
        const { success } = result;
        if (success) {
          console.log('Fingerprint authentication successful');
          
          navigation.navigate('BottomScreens')          
        } else {
          console.log('Fingerprint authentication failed');
        }
      })
      .catch((error) => {
        console.log('Biometric not available or failed', error);
      });
  };

  return (
    <View style={{width: '100%', height: '100%', backgroundColor:COLORS.secondary, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={biometricVerification}>
        <Text>Unlock</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Splash