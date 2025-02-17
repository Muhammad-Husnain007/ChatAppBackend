import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../../utils/Colors'
import HomeNavbar from '../../../components/HomeNavbar'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import CustomButton from '../../../components/CustomButton'

const Communities = () => {
  return (
    <>
   <HomeNavbar 
   extraStyle={{fontWeight: '400', colors: COLORS.black, fontSize: getResponsiveFontSize(22),}}
   title={'Communities'}
    />
    <View style={{width: '100%', height: '100%', backgroundColor: COLORS.white, 
       alignItems: 'center', gap: 10, paddingVertical: getResponsiveHeight(20)}}>
        <Text style={{fontSize:getResponsiveFontSize(18), color:COLORS.black}}>
          Stay connected with a communities
        </Text>
        <Text style={{fontSize:getResponsiveFontSize(14), color:COLORS.black, textAlign:'center', lineHeight: getResponsiveHeight(2.4)}}>
        Communities bring members to gether topic-base {`\n`} groups, and make it easy to get admin to {`\n`} annoucements.
        Any community yo are {`\n`} added to will appear here.
        </Text>
        <CustomButton
          text='Stay your community'
          extraStyle={{backgroundColor:COLORS.darkGreen, top: getResponsiveHeight(5),}}
        />
       
    </View>
   </>
  )
}

export default Communities