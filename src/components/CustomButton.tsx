import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getResponsiveFontSize, getResponsiveHeight } from '../utils/ResponsiveNess';
import { COLORS } from '../utils/Colors';

const CustomButton = ({
  text = '', 
  onPress = () => {},
  extraStyle = {},
  textStyle = {},
  showLoader = false,    
  loaderDuration = 3000, 
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    if (showLoader) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onPress(); 
      }, loaderDuration);
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row', // Align text and loader horizontally
          width: '90%',
          height: getResponsiveHeight(6),
          borderRadius: 100,
        },
        extraStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: getResponsiveFontSize(12),
            // fontWeight: 'bold',
            color: COLORS.white,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
      {loading && (
        <ActivityIndicator
          size="small"
          color={COLORS.white}
          style={{ marginLeft: 10 }} // Add spacing between text and loader
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
