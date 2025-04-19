import { View, Text, TouchableOpacity, Image, Modal, PermissionsAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess'
import { COLORS } from '../utils/Colors'
import { ICONS_URI } from '../constants/Icons'
import { useNavigation } from '@react-navigation/native'
import { launchCamera } from 'react-native-image-picker';
import DotsModal from './modals/DotsModal'

const HomeNavbar = ({title= '', extraStyle={}}) => {
  const navigation:any = useNavigation()
  const [cameraAccess, setCameraAccess] = useState(false);

  useEffect(() => {
    const requestCameraPermission  = async() => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
          title: 'Camera permission is requird',
          message:
          'This app needs camera access to allow you to take pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Deny',
        buttonPositive: 'OK',
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          setCameraAccess(true); 
          openCamera(); 
        } else {
          console.log('Camera permission denied');
          setCameraAccess(false); 
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestCameraPermission();
  }, []);

  const openCamera = async() => {
    if(cameraAccess){
      const result = await launchCamera({
        mediaType: 'mixed',
        saveToPhotos: true
      },
      response => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('Error: ', response.errorMessage);
        } else {
          console.log('Image captured: ', response.assets[0].uri);
          Alert.alert('Success', 'Image captured successfully!');
        }
      },
    )
    } else{
      console.log('Permission is required')
    }
  }

  return (
    <>
    <View style={{
      width: '100%', height: getResponsiveHeight(11), backgroundColor: COLORS.lightWhite, alignItems: 'center', justifyContent: 'space-between',
      gap: 0, paddingHorizontal: getResponsiveWidth(3), flexDirection: 'row'
  }}>
      <Text style={[{ fontSize: getResponsiveFontSize(26), color: COLORS.primary, fontWeight: '600' }, extraStyle]}>{title}</Text>

      <View style={{flexDirection: 'row', gap: 30}}>
      <TouchableOpacity onPress={openCamera}>
          <Image style={{ width: getResponsiveHeight(2.5), height: getResponsiveHeight(2.5), tintColor: COLORS.black }} source={ICONS_URI.camera} />
      </TouchableOpacity>
      <DotsModal
       text1='Contact info'
       text2='Contact info'
       text3='Add Fingerprint'
       text4='Setting'
       onPress={() => navigation.navigate('OpenSetting')}
       addFingerPrint={() => navigation.navigate('AppLock')}
      />
  </View>

  </View>
    </>
  )
}

export default HomeNavbar