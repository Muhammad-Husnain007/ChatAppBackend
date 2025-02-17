// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import React, { useState } from 'react';
// import OTPTextInput from 'react-native-otp-textinput';
// import { COLORS } from '../../utils/Colors';
// import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../utils/ResponsiveNess';
// import ScreensNavbar from '../../components/ScreensNavbar';
// import CustomButton from '../../components/CustomButton';

// const EnterOtp = ({ navigation, route }: any) => {
//   const [code, setCode] = useState(''); 
//   const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']); 
//   const {confirmation} = route.params;
//   console.log('confirmatin:', confirmation)

//   const handleVerify = async () => {
//     try {
//       console.log('Entered code:', code);

//       if (code.length !== 6) {
//         Alert.alert('Invalid OTP', 'Please enter a 6-digit code.');
//         return;
//       }
//       if (!confirmation) {
//         Alert.alert('Error', 'No confirmation object found. Please retry.');
//         return;
//       }
//       await confirmation.confirm(code)
//       navigation.navigate("BottomScreens");

//     } catch (error) {
//       console.error('Error confirming code:', error);
//       Alert.alert('Verification Failed', 'Invalid or expired OTP.');
//     } finally {
//     }
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     const newOtpArray = [...otpArray];
//     newOtpArray[index] = value;
//     setOtpArray(newOtpArray);
//     const combinedOtp = newOtpArray.join('');
//     setCode(combinedOtp);
//   };


//   return (
//     <>
//       <ScreensNavbar text="Verify your phone number" />

//       <View style={{ flex: 1, alignItems: 'center', paddingVertical: getResponsiveHeight(20), backgroundColor: COLORS.secondary }}>
//         {/* OTP Inputs */}
//         <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//           {otpArray.map((digit, index) => (
//             <OTPTextInput
//               key={index}
//               textInputStyle={{ width: getResponsiveWidth(10), borderColor: 'black', }}
//               inputCount={1}
//               handleTextChange={(value: string) => handleOtpChange(index, value)}
//               defaultValue={digit}
//               keyboardType="number-pad"
//             />
//           ))}
//         </View>

//         {/* Resend Option */}
//         <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
//           <Text style={{ top: getResponsiveHeight(5), color: 'blue', fontSize: getResponsiveFontSize(14) }}>Resend code?</Text>
//         </TouchableOpacity>

//         {/* Verify Button */}
//         <CustomButton
//           text="Verify"
//           extraStyle={{ width: '50%', backgroundColor: COLORS.primary, position: 'absolute', bottom: getResponsiveHeight(5) }}
//           textStyle={{ fontSize: getResponsiveFontSize(18) }}
//           onPress={handleVerify}
//           showLoader={true}
//         />
//       </View>
//     </>
//   );
// };

// export default EnterOtp;

import { View, Text } from 'react-native'
import React from 'react'

const EnterOtp = () => {
  return (
    <View>
      <Text>EnterOtp</Text>
    </View>
  )
}

export default EnterOtp
