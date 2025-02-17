import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {TouchableOpacity, View, Text, Image} from 'react-native'
import CustomButton from '../../components/CustomButton'
import { IMAGES_URI } from '../../constants/Images'
import { COLORS } from '../../utils/Colors'
import { getResponsiveFontSize, getResponsiveHeight } from '../../utils/ResponsiveNess'

const AgreeContinue = ({navigation} : any) => {

  return (
    <View style={{width: '100%', height: '100%', justifyContent: 'space-between', paddingVertical: 80,
     alignItems: 'center', backgroundColor: 'white' }}>

    <Text style={{fontSize: getResponsiveFontSize(22), color: COLORS.primary,}}>Welcome to WhatsApp</Text>
    <Image style={{width: '94%', height: '60%', position: 'relative', top: getResponsiveHeight(3)}} source={IMAGES_URI.agreeAndContinue} />
   
   <Text style={{top: getResponsiveHeight(4), textAlign: 'center', lineHeight: 20, color: COLORS.primary, fontSize: getResponsiveFontSize(12)}}> 
   Read our Privacy Policy, Tap "Agree and continue"
   {`\n`} to accept the Terms of Service.
   </Text>
     <View style={{ width: '100%', height: '24%', backgroundColor: 'white',
     top: 70, display: 'flex', alignItems: 'center',
     justifyContent: 'center'
     }}>
      <CustomButton
         text='Agree and Continue'
         onPress={() => navigation.navigate('EnterNumber')}
         extraStyle={{backgroundColor: COLORS.primary}}
      />
    </View>
    </View>
  )
}

export default AgreeContinue;
