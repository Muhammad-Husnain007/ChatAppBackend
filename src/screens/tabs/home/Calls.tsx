import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../../../utils/Colors'
import HomeNavbar from '../../../components/HomeNavbar'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import { ICONS_URI } from '../../../constants/Icons'

const Calls = () => {
  return (
    <>
   <HomeNavbar 
   extraStyle={{fontWeight: '400', colors: COLORS.black, fontSize: getResponsiveFontSize(22),}}
   title={'Calls'}
    />
    <ScrollView style={{width: '100%', backgroundColor: COLORS.white,}}>
      <View style={{width: '100%', paddingVertical: 5, backgroundColor:COLORS.white, paddingHorizontal: getResponsiveWidth(5),
        flexDirection: 'row', gap: getResponsiveWidth(7)
      }}>
        <View style={{width: getResponsiveWidth(14), height: getResponsiveWidth(14), borderRadius: 100,
          backgroundColor:COLORS.lightGray, justifyContent: 'center', alignItems: 'center',
        }}>

          <Image source={ICONS_URI.User} />
        </View>
        <View>
        <Text style={{fontSize: getResponsiveFontSize(16), top: 10, color:COLORS.black}}>User Name</Text>
        <Text style={{fontSize: getResponsiveFontSize(12), top: 10, color:COLORS.black}}>Today 4:05 PM</Text>
        </View>
        <Image style={{position: 'absolute', right: 30,  top: getResponsiveHeight(2), tintColor: COLORS.primary}} source={ICONS_URI.greenCall} />
      </View>
    </ScrollView>
   </>
  )
}

export default Calls