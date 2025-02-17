import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { ICONS_URI } from '../constants/Icons'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess'
import { COLORS } from '../utils/Colors'
import { useNavigation } from '@react-navigation/native'

const ScreensNavbar = ({
    text = '',
    extraStyle = {},
    
}) => {
    const navigation = useNavigation()
    return (
        <View style={[{
            width: '100%', height: getResponsiveHeight(10), backgroundColor: COLORS.white, alignItems: 'center',
            gap: getResponsiveWidth(5), paddingHorizontal: 25, flexDirection: 'row'
        }, extraStyle]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={{ width: getResponsiveWidth(5), height: getResponsiveHeight(2.5), tintColor: 'black' }} 
                source={ICONS_URI.ChatBack} />
            </TouchableOpacity>
            
            <Text style={{ fontSize: getResponsiveFontSize(18), color: COLORS.black }}>{text}</Text>
          
        </View>
    )
}

export default ScreensNavbar