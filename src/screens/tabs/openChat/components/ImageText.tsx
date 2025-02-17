import { View, Text, Image } from 'react-native'
import React from 'react'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../../utils/ResponsiveNess'
import { COLORS } from '../../../../utils/Colors'

const ImageText = ({
    source={},
    text1='',
    text2='',
    extraStyle={},
    imageStyle={}
}) => {
  return (
    <View style={[{width: '100%', paddingVertical: getResponsiveHeight(2),
     backgroundColor:COLORS.white, flexDirection: 'row', gap: getResponsiveWidth(10),
     paddingHorizontal: getResponsiveWidth(5), marginTop: getResponsiveHeight(0.7),
     alignItems: 'center'
     }, extraStyle]}>
        <Image style={[{width: getResponsiveWidth(5), height: getResponsiveWidth(5), 
        tintColor:COLORS.primary, resizeMode: 'contain'}, imageStyle]} 
        source={source} />
        <View style={{}}>
        <Text style={{fontSize:getResponsiveFontSize(16), color:COLORS.black}}>{text1}</Text>
        <Text style={{fontSize:getResponsiveFontSize(10), color:COLORS.primary}}>{text2}</Text>
        </View>
    </View>
  )
}

export default ImageText