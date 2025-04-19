import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../../utils/Colors'
import ChatNavbar from '../../../components/ChatNavbar'
import ScreensNavbar from '../../../components/ScreensNavbar'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import { ICONS_URI } from '../../../constants/Icons'
import NavButton from './components/NavButton'
import ImageText from './components/ImageText'

const OpenChatUser = ({navigation, route}: any) => {
  const {contactProfile, firstName, lastName} = route.params;
  console.log(contactProfile, 'hai')

  return (
    <>
     
    <ScrollView style={{width: '100%', height: '100%', backgroundColor:COLORS.secondary}}>
     <View style={{width: '100%', padding: 15, backgroundColor:COLORS.white}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>

      <Image style={{width: 24, height: 24}} source={ICONS_URI.ChatBack} />
      </TouchableOpacity>
     </View>

      <View style={{width: '100%', paddingVertical: getResponsiveHeight(1), backgroundColor:COLORS.white, 
        alignItems: 'center', gap: getResponsiveHeight(1)
      }}>
        <View style={{width: getResponsiveWidth(30), justifyContent: 'center', alignItems: 'center', height: getResponsiveWidth(30), borderRadius: 100, backgroundColor:COLORS.lightGray}}>
       <Image source={contactProfile ? contactProfile : ICONS_URI.User} style={{width: '50%', height: '50%'}} />
        </View>

        <Text style={{fontSize: getResponsiveFontSize(22), color: COLORS.black}}>Name User</Text>
        <Text style={{fontSize: getResponsiveFontSize(14), color: COLORS.primary}}>0123456789</Text>
        <View style={{paddingHorizontal: 30,  paddingVertical: 5, backgroundColor:COLORS.lightGray, borderRadius:10}}>
        <Text style={{fontSize: getResponsiveFontSize(14), color: COLORS.primary}}>last seeen at 9:20</Text>
        </View>
        <NavButton />
      </View>

      <ImageText 
        source={ICONS_URI.notification}
        text1='Notifications'
        text2='all notifications'
      />
      <View style={{marginTop: getResponsiveHeight(0.8), backgroundColor:COLORS.white}}>

      <ImageText 
        source={ICONS_URI.privacy}
        text1='Encryption'
        text2='messags and calls are end to end encrypted.'
        extraStyle={{}}
      />
      <ImageText 
        source={ICONS_URI.timer}
        text1='Dissapearing messages'
        text2='off'
        extraStyle={{}}
      />
      <ImageText 
        source={ICONS_URI.privateChat}
        text1='Chat lock'
        text2='lock and hide this chat on this device'
        extraStyle={{}}
      />
      </View>
      <ImageText 
        source={ICONS_URI.block}
        text1='Block'
        text2='block userName'
        imageStyle={{tintColor: 'red'}}
      />
      <ImageText 
        source={ICONS_URI.unlike}
        text1='Report'
        text2='report userName'
        imageStyle={{tintColor: 'red'}}
        extraStyle={{marginBottom: getResponsiveHeight(1)}}
      />
    </ScrollView>
    </>
  )
}

export default OpenChatUser