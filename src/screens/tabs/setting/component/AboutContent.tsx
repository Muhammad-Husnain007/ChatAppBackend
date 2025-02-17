import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../../../utils/Colors'
import { ICONS_URI } from '../../../../constants/Icons'
import { getResponsiveFontSize, getResponsiveWidth } from '../../../../utils/ResponsiveNess'

const AboutContent = ({
    text1='',
    text2='',
    text3='',
    source={},
    image=false,
    onPress=()=>{}
}) => {
  return (
    <View style={{width: '100%', padding: getResponsiveWidth(5) , backgroundColor:COLORS.white, flexDirection: 'row', gap: 40, alignItems: 'center'}}>
        <Image source={source} style={{tintColor: COLORS.primary}} />
        <View style={{gap: 2}}>
            <Text style={{fontSize:getResponsiveFontSize(18), color:COLORS.black}}>{text1}</Text>
            <Text style={{fontSize:getResponsiveFontSize(16), color:COLORS.black}}>{text2}</Text>
            <Text style={{fontSize:getResponsiveFontSize(12), color:COLORS.black}}>{text3}</Text>
        </View>
        {image && <TouchableOpacity style={{position: 'absolute', right: getResponsiveWidth(5)}} onPress={onPress}>
        <Image style={{tintColor:COLORS.primary, resizeMode: 'contain', width: getResponsiveWidth(6),
         }} source={ICONS_URI.marker} />
        </TouchableOpacity>}
    </View>
  )
}

export default AboutContent