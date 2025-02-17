import { View, Text, Image } from 'react-native'
import React from 'react'
import { getResponsiveWidth } from '../../../../utils/ResponsiveNess'
import { COLORS } from '../../../../utils/Colors'
import { ICONS_URI } from '../../../../constants/Icons'

const NavButton = () => {
  return (
    <View style={{flexDirection: 'row', gap: getResponsiveWidth(2), paddingVertical: 10}}>

    <View style={{paddingVertical: getResponsiveWidth(2.7), paddingHorizontal:getResponsiveWidth(10), 
      gap: 10, borderRadius: 10, borderColor:COLORS.green, borderWidth: 1,}}>
        <Image style={{tintColor: COLORS.primary}} source={ICONS_URI.greenCall} />
        <Text>Audio</Text>
    </View>
    <View style={{paddingVertical: getResponsiveWidth(2.7), paddingHorizontal:getResponsiveWidth(10), 
      gap: 10, borderRadius: 10, borderColor:COLORS.green, borderWidth: 1,}}>
        <Image style={{tintColor: COLORS.primary}} source={ICONS_URI.greenCall} />
        <Text>Audio</Text>
    </View>
    <View style={{paddingVertical: getResponsiveWidth(2.7), paddingHorizontal:getResponsiveWidth(10), 
      gap: 10, borderRadius: 10, borderColor:COLORS.green, borderWidth: 1,}}>
        <Image style={{tintColor: COLORS.primary}} source={ICONS_URI.greenCall} />
        <Text>Audio</Text>
    </View>
    </View>
  )
}

export default NavButton