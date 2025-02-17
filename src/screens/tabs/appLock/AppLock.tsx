import { View, Text, Alert, Animated, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import ReactNativeBiometrics from 'react-native-biometrics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScreensNavbar from '../../../components/ScreensNavbar'
import { getResponsiveFontSize, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import { COLORS } from '../../../utils/Colors'
import { ICONS_URI } from '../../../constants/Icons'

const AppLock = () => {
    const [position] = useState(new Animated.Value(0));
    const [isEnable, setIsEnable] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
  
    useEffect(() => {
      const fetchLockOption = async () => {
        const lockOption = await AsyncStorage.getItem('lockOption');
        if (lockOption) {
          setSelectedOption(lockOption);  
          if (lockOption === 'immediately') {
            setIsEnable(true); 
          } else if(lockOption === 'after1min'){
            setIsEnable(true); 
          } else if(lockOption === 'after30min'){
            setIsEnable(true); 
          }
        }
      };
      fetchLockOption();
    }, []);
  
    useEffect(() => {
        const initialPosition = isEnable
          ? getResponsiveWidth(9) - getResponsiveWidth(6) + getResponsiveWidth(6)
          : getResponsiveWidth(9) - getResponsiveWidth(6) - getResponsiveWidth(3);
    
        position.setValue(initialPosition); 
      }, [isEnable]);
    
      const moveDotOnPress = () => {
        if (!isEnable) {
          Animated.spring(position, {
            toValue: getResponsiveWidth(9) - getResponsiveWidth(6) + getResponsiveWidth(6),
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(position, {
            toValue: getResponsiveWidth(9) - getResponsiveWidth(6) - getResponsiveWidth(3),
            useNativeDriver: true,
          }).start();
        }
      };
  
    const handleBiometricAuthentication = () => {
      const rnBiometric = new ReactNativeBiometrics();
      rnBiometric.simplePrompt({
        cancelButtonText: 'Cancel',
        promptMessage: 'Confirm biometric',
      })
        .then(async(result) => {
          const { success } = result;
          if (success) {
            console.log('Fingerprint authentication successful');
            const newState = !isEnable;
        setIsEnable(newState);
        moveDotOnPress();

        if (!newState) {
          await AsyncStorage.setItem('lockOption', '');
          setSelectedOption(null); // Reset UI
        }
          } else {
            console.log('Fingerprint authentication failed');
          }
        })
        .catch((error) => {
          console.log('Biometric not available or failed', error);
        });
    };
  
    const handleOptionSelect = async (option) => {
      try {
        setSelectedOption(option);
        if (option === 'immediately') {
          await AsyncStorage.setItem('lockOption', 'immediately');
        } else if (option === 'after1min') {
          await AsyncStorage.setItem('lockOption', 'after1min');
        } else if (option === 'after30min') {
          await AsyncStorage.setItem('lockOption', 'after30min');
        } else {
          setIsEnable(false)
          setSelectedOption(null)

        }
  
        const savedOption = await AsyncStorage.getItem('lockOption');
        console.log('Option saved successfully!', savedOption);
      } catch (error) {
        console.error('Failed to save option:', error);
      }
    };
  
  return (
    <>
      <ScreensNavbar text='App Lock' />
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ width: '100%', padding: getResponsiveWidth(4), flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1 }}>
          <View style={{gap: 10}}>
            <Text style={{fontSize: getResponsiveFontSize(18), color: COLORS.black}}>Unlock with biometric</Text>
            <Text>When you enable this, you'll .</Text>
          </View>
          <TouchableOpacity onPress={handleBiometricAuthentication} style={[styles.switchView, {backgroundColor: isEnable ? COLORS.primary: COLORS.gray}]}>
            <Animated.View
              style={[
                styles.dotMove,
                {
                  transform: [{ translateX: position }],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        {isEnable ? (
      <View style={{ width: '100%', padding: getResponsiveWidth(5) }}>
        <Text style={{ fontSize: getResponsiveFontSize(14), color: COLORS.black }}>Automatically lock</Text>
        <View style={{ width: '100%', gap: 10 }}>
          {/* Option 1 */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOptionSelect("immediately")} style={{ flexDirection: 'row', gap: 20, top: 20 }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={selectedOption === "immediately" ? ICONS_URI.select : ICONS_URI.notSelect}
              />
            <Text style={styles.textText}>Immediately</Text>
            </TouchableOpacity>
          {/* Option 2 */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOptionSelect("after1min")} style={{ flexDirection: 'row', gap: 20, top: 20 }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={selectedOption === "after1min" ? ICONS_URI.select : ICONS_URI.notSelect}
              />
            <Text style={styles.textText}>After 1 minute</Text>
            </TouchableOpacity>
         
          {/* Option 3 */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleOptionSelect("after30min")} style={{ flexDirection: 'row', gap: 20, top: 20 }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={selectedOption === "after30min" ? ICONS_URI.select : ICONS_URI.notSelect}
              />
            <Text style={styles.textText}>After 30 minutes</Text>
            </TouchableOpacity>
        </View>
      </View>
    ) : null}
      </View>
    </>
  );
};

export default AppLock;

const styles = StyleSheet.create({
  switchView: {
    width: getResponsiveWidth(18),
    height: getResponsiveWidth(9),
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  dotMove: {
    width: getResponsiveWidth(6),
    height: getResponsiveWidth(6),
    backgroundColor: 'white',
    borderRadius: 100,
  },
  textText:{
    fontSize: getResponsiveFontSize(12),
    color: COLORS.black
  }
});
