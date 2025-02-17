import { View, Text, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import ScreensNavbar from '../../../components/ScreensNavbar'
import { ICONS_URI } from '../../../constants/Icons'
import CustomInput from '../../../components/CustomInput'
import { getResponsiveHeight } from '../../../utils/ResponsiveNess'
import { COLORS } from '../../../utils/Colors'
import CustomButton from '../../../components/CustomButton'
import axios from 'axios'
import { API } from '../../../api/Api'

const AddContacts = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  console.log(API.authToken)
  console.log(API.userId)
  const handleSave = async() => {
    if(!firstName || !lastName || !phoneNumber){
       Alert.alert('', 'All fields are required')
    }
   try {
    const addContact = await axios.post(`${API.BASE_URI}/contact/newContact/${API.userId}`, {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });
    console.log('add contact successfully: ',addContact)
    navigation.navigate('BottomScreens')
   } catch (error) {
    console.log('Error:', error)
   }
  }
  return (
   <>
   <ScreensNavbar text='New contact' />
   <View style={{width: '100%', height: '100%', justifyContent: 'space-between', backgroundColor: 'white',}}>
    <View style={{width: '100%', height: '50%', paddingVertical: getResponsiveHeight(5)}}>
    <View style={{justifyContent: 'center', width: '98%',
      alignItems: 'center', gap: 20
    }}>
      <CustomInput
       placeholder='Enter first name'
        value={firstName} 
        onChange={(firstName) => setFirstName(firstName)}
        inputStyle={{paddingLeft: 10}}
      />
      <CustomInput
        placeholder='Enter last name'
        value={lastName}      
        onChange={(lastName) => setLastName(lastName)}
        inputStyle={{paddingLeft: 10}}
      />
      <CustomInput
      placeholder='Enter phone number'
        value={phoneNumber}
        onChange={(number) => setPhoneNumber(number)}
        inputStyle={{paddingLeft: 10}}
      />

    </View>

    </View>

    <View style={{width: '100%', height: '22%', alignItems: 'center'}}>
      <CustomButton
        text='Save'
        extraStyle={{width: '90%', padding: 10, backgroundColor: COLORS.primary}}
        onPress={handleSave}
        showLoader={true}
      />
    </View>
   </View>
   </>
  )
}

export default AddContacts;