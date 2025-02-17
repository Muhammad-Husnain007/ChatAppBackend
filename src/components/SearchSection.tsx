import { View, Text, TextInput, Image } from 'react-native'
import React from 'react'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess'
import { COLORS } from '../utils/Colors'
import { ICONS_URI } from '../constants/Icons'

const SearchSection = () => {
  return (
    <View style={{width: '100%', height: getResponsiveHeight(10), backgroundColor: COLORS.secondary, justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Image style={{alignSelf: 'flex-start', zIndex: 1, top: getResponsiveHeight(3.7), 
            left: getResponsiveWidth(8), tintColor: COLORS.primary, position: 'absolute'
        }} source={ICONS_URI.search} />
        <TextInput
        style={{width: '94%', height: getResponsiveHeight(6.5), backgroundColor: COLORS.lightGray, borderRadius: 100, color: COLORS.black, 
        paddingHorizontal: 60, fontSize: getResponsiveFontSize(17)}}
        placeholder='Search chats'
        />
    </View>
  )
}

export default SearchSection;