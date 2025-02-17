import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreensNavbar from '../../../components/ScreensNavbar'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import { COLORS } from '../../../utils/Colors'
import { ICONS_URI } from '../../../constants/Icons'
import ImageText from '../openChat/components/ImageText'
import axios from 'axios'
import { API } from '../../../api/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OpenSetting = ({ navigation }: any) => {
  const [receiveProfile, setReceiveProfile] = useState<string | null>(null);

  const receiveProfileImage = async () => {
    try {
      const response = await axios.get(
        `${API.BASE_URI}/profile/receiveByUserId/${API.userId}`
      );
      const receivePath = response.data.data[0]?.profile?.profile;
      console.log('Received Image Path:', receivePath);
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

  const [name, setName] = useState<string | null>(null);
  const [about, setAbout] = useState<string | null>(null);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedAbout = await AsyncStorage.getItem('userAbout');
        setName(storedName);
        setAbout(storedAbout);
        console.log('about:', storedAbout?.length);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, []);



  return (
    <>
      <ScreensNavbar text='Setting' />
      <ScrollView style={{ width: '100%', backgroundColor: COLORS.secondary, padding: 10 }}>

        <TouchableOpacity onPress={() => navigation.navigate('OpenAbout')} style={{
          width: '100%', paddingVertical: getResponsiveHeight(2),
          paddingHorizontal: 20, gap: 20, flexDirection: 'row', backgroundColor: COLORS.white
        }}>
          <View style={{
            width: getResponsiveWidth(18), height: getResponsiveWidth(18), backgroundColor: COLORS.lightGray,
            borderRadius: 100, justifyContent: 'center', alignItems: 'center'
          }}>
            <Image source={receiveProfile ? { uri: receiveProfile } : ICONS_URI.User} style={{ width: '90%', height: '90%', borderRadius: 100, }} />
          </View>

          <View style={{}}>
            <Text style={{ fontSize: getResponsiveFontSize(18), color: COLORS.black }}>{name || 'Your name'}</Text>
            <Text style={{ fontSize: getResponsiveFontSize(14), color: COLORS.black }}>
              {about
                ? about.length > 27
                  ? about.slice(0, 27) + '\n' + about.slice(27)
                  : about
                : 'Hey, I am using WhatsApp'}

            </Text>
          </View>
          <View style={{ top: getResponsiveHeight(3), left: getResponsiveWidth(12) }}>
            <Image style={{ tintColor: COLORS.primary }} source={ICONS_URI.scanner} />
          </View>

        </TouchableOpacity>
        <ImageText
          source={ICONS_URI.notification}
          text1='Notification'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.privacy}
          text1='Privacy'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.notification}
          text1='Avatar'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.comment}
          text1='Chats'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.list}
          text1='Lists'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.storageCloud}
          text1='Storage and data'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.world}
          text1='App language'
          text2='all notifications'
        />
        <ImageText
          source={ICONS_URI.questionMark}
          text1='Help'
          text2='all notifications'
        />
      </ScrollView>
    </>
  )
}

export default OpenSetting