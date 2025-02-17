import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { getResponsiveHeight } from '../utils/ResponsiveNess'
import { COLORS } from '../utils/Colors'

const CustomInput = ({
  placeholder = '',
  inputMainStyle = {},
  inputStyle = {},
  inputRef = null,
  value = '',
  multiline = false,
  keyboardType= '',
  onChange = (text: any) => { },
}) => {
  return (
    <View style={[{ width: '90%', height: getResponsiveHeight(7), backgroundColor: COLORS.white, borderRadius: 5, borderWidth: 1, borderColor: COLORS.gray }
      , inputMainStyle
    ]}>
      <TextInput
        placeholder={placeholder}
        style={[{ paddingVertical: 15 }, inputStyle]}
        multiline={multiline}
        value={value}
        ref={inputRef}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />

    </View>
  )
}

export default CustomInput