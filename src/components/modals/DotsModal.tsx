import { View, Text, TouchableOpacity, Image, Modal, } from 'react-native'
import React, { useState } from 'react'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../utils/ResponsiveNess'
import { COLORS } from '../../utils/Colors';
import { ICONS_URI } from '../../constants/Icons';

const DotsModal = ({
    onPress=() => {},
    text1='',
    text2='',
    text3='',
    text4='',
    addFingerPrint=()=> {},
    dotsStyle={}
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddFingerPrint = () => {
    setModalVisible(false); 
    addFingerPrint();       
};

const handleOnPress = () => {
    setModalVisible(false); 
    onPress(); 
};

  return (
    <>
    <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image style={[dotsStyle,{ width: getResponsiveHeight(2.5), height: getResponsiveHeight(2.5), tintColor: COLORS.black }]} source={ICONS_URI.threeDots} />
      </TouchableOpacity>
      { modalVisible && (
        <Modal transparent={true}>
          <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(false)} style={{width: '100%', height: '100%', alignItems: 'flex-end', padding: getResponsiveWidth(4), paddingVertical: getResponsiveHeight(8),}}>
          <View style={{width: '50%', zIndex: 1000, padding: getResponsiveWidth(4), gap: 20, backgroundColor:COLORS.white, borderRadius: 10}}>
            <Text style={{fontSize:getResponsiveFontSize(14), color:COLORS.black}}>{text1}</Text>
            <Text style={{fontSize:getResponsiveFontSize(14), color:COLORS.black}}>{text2}</Text>
            <TouchableOpacity onPress={handleAddFingerPrint}>

            <Text style={{fontSize:getResponsiveFontSize(14), color:COLORS.black}}>{text3}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOnPress}>
            <Text style={{fontSize:getResponsiveFontSize(14), color:COLORS.black}}>{text4}</Text>
            </TouchableOpacity>

          </View>
          </TouchableOpacity>
        </Modal>
      
      )}
    </>
 

  )
}

export default DotsModal