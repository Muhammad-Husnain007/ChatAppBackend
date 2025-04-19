import { View, Text, Image, TouchableOpacity, Alert, Button, TextInput, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreensNavbar from '../../../components/ScreensNavbar'
import { ICONS_URI } from '../../../constants/Icons'
import { COLORS } from '../../../utils/Colors'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import AboutContent from './component/AboutContent'
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios'
import { API } from '../../../api/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpenAbout = ({ navigation }: any) => {
  const [selectedUri, setSelectedUri] = useState(null);
  const [receiveProfile, setReceiveProfile] = useState(null);
  const [name, setName] = useState(null);
  const [about, setAbout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState<any>('');

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedName: any = await AsyncStorage.getItem('userName');
        const storedAbout: any = await AsyncStorage.getItem('userAbout');
        if (storedName) setName(storedName);
        if (storedAbout) setAbout(storedAbout);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    fetchStoredData();
  }, []);

  const openModal = async (type: any) => {
    setModalType(type);
    const storedValue = await AsyncStorage.getItem(type === 'name' ? 'userName' : 'userAbout');
    setInputValue(storedValue || '');
    setModalVisible(true);
  };

  const updateValue = async () => {
    try {
      const key: string = modalType === 'name' ? 'userName' : 'userAbout';
      await AsyncStorage.setItem(key, inputValue);
      modalType === 'name' ? setName(inputValue) : setAbout(inputValue);
      setModalVisible(false);
    } catch (error) {
      console.error(`Error updating ${modalType}:`, error);
    }
  };

  const uploadProfile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      if (result && result[0]) {
        const file: any = result[0];
        console.log('File:', file.uri);
        const formData = new FormData();
        formData.append('profile', {
          uri: file.uri,
          name: file.name || 'profile.jpg',
          type: file.type || 'image/jpeg',
        });

        const uploadResponse = await axios.post(
          `${API.BASE_URI}/profile/upload/${API.userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.data) {
          setSelectedUri(file.uri);
          await receiveProfileImage();
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled document picker');
      } else {
        console.error('Error uploading profile:', error);
      }
    }
  };

  const receiveProfileImage = async () => {
    try {
      const response = await axios.get(
        `${API.BASE_URI}/profile/receiveByUserId/${API.userId}`
      );
      const receivePath = response.data.data[0]?.profile?.profile;
      if (receivePath) {
        setReceiveProfile(receivePath);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    receiveProfileImage();
  }, []);

  const showImage = selectedUri || receiveProfile;

  const viewOrUpload = async () => {
    Alert.alert("Profile",
      "Upload Profile or View Profile",
      [
        {
          text: "Upload",
          onPress: uploadProfile,
        },
        {
          text: "View",
          onPress: () => navigation.navigate('ViewProfile', { profile: showImage }),
        }
      ],
      { cancelable: true }
    )
  }

  return (
    <>
      <ScreensNavbar text='Profile' />
      <View style={{
        width: '100%', paddingVertical: getResponsiveHeight(1), backgroundColor: COLORS.white,
        alignItems: 'center', gap: getResponsiveHeight(1), height: '100%',
      }}>
        <TouchableOpacity onPress={showImage ? viewOrUpload : uploadProfile} style={{ width: getResponsiveWidth(30), justifyContent: 'center', alignItems: 'center', height: getResponsiveWidth(30), borderRadius: 100, backgroundColor: COLORS.lightGray }}>
          <Image source={showImage ? { uri: showImage } : ICONS_URI.User} style={{ width: '94%', height: '94%', borderRadius: 100 }} />
        </TouchableOpacity>

        <AboutContent
          text1='Name' text2={name || "Your Name"} text3='This is not your username or pin.'
          source={ICONS_URI.User} image={true} onPress={() => openModal('name')}
        />

        <AboutContent
          text1='About' text2={about || 'Hey there! I am using this app.'}
          source={ICONS_URI.timer} image={true} onPress={() => openModal('about')}
        />

        <AboutContent
          text1='Phone'
          text2='+92 3482854628'
          source={ICONS_URI.greenCall}
        />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
              <Text style={{ fontSize: getResponsiveFontSize(16), marginBottom: getResponsiveHeight(3), color: COLORS.black }}>Enter your {modalType}:</Text>
              <TextInput
                value={inputValue}
                onChangeText={(text) => {
                  if (modalType === 'about' && text.length > 37) return;
                  setInputValue(text);
                  if (modalType === 'name' && text.length > 18) return;
                  setInputValue(text);
                }}
                maxLength={modalType === 'about' ? 37 : 18}
                placeholder="Enter text..."
                style={{ width: '100%', height: getResponsiveHeight(5), borderRadius: 10,
                  marginBottom: getResponsiveHeight(2), borderColor: COLORS.silver, borderWidth: 1, padding: 10 }} 
              />

              <TouchableOpacity style={{ width: '100%', height: getResponsiveHeight(5.5), borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }} onPress={updateValue}>
                <Text style={{ fontSize: getResponsiveFontSize(16), color: COLORS.white }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </>
  )
}

export default OpenAbout;
