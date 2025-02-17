import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { ICONS_URI } from '../constants/Icons'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess'
import { COLORS } from '../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import DotsModal from './modals/DotsModal'

const ChatNavbar = ({
    text = '',
    image = false,

}) => {
    const navigation: any = useNavigation()

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('OpenChatUser')} style={{
            width: '100%', height: getResponsiveHeight(10), backgroundColor: COLORS.white, alignItems: 'center',
            gap: getResponsiveWidth(4), paddingHorizontal: 25, flexDirection: 'row'
        }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={{ width: getResponsiveWidth(6), height: getResponsiveHeight(3), tintColor: 'black' }} source={ICONS_URI.ChatBack} />
            </TouchableOpacity>
            <View style={{
                width: getResponsiveHeight(6), height: getResponsiveHeight(6), borderRadius: 30, backgroundColor: COLORS.lightGray,
                justifyContent: 'center', alignItems: 'center'
            }}>
                <Image source={ICONS_URI.User} />
            </View>

            <Text style={{ fontSize: getResponsiveFontSize(18), color: COLORS.black }}>{text}</Text>

            {image &&
                <View style={{flexDirection: 'row', position: 'absolute', right: getResponsiveWidth(5), 
                   gap: getResponsiveWidth(5)}}>
                    <TouchableOpacity onPress={() => { }}>
                        <Image style={{ transform: [{ rotate: '10deg' }], tintColor:COLORS.black,  }} source={ICONS_URI.greenCall} />
                    </TouchableOpacity>
             
                 <DotsModal
                     text1='Contact info'
                     text2='Contact info'
                     text3='Contact info'
                     text4='Setting'
                    />
                </View>
            }
        </TouchableOpacity>
    )
}

export default ChatNavbar;