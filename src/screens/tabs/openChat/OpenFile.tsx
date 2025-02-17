import { View, Text, Image } from 'react-native';
import React from 'react';
import { COLORS } from '../../../utils/Colors';
import { getResponsiveHeight } from '../../../utils/ResponsiveNess';
import Video from 'react-native-video';

type RouteParams = {
  route: {
    params: {
      openFile: string;
    };
  };
};

const OpenFile: React.FC<RouteParams> = ({ route }) => {
  const { openFile, type } = route.params;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
     { type === 'image' ?
      <Image
        source={{ uri: openFile }}
        style={{
          width: '100%',
          height: getResponsiveHeight(50),
          resizeMode: 'contain',
        }}
      />:
       <Video
        source={{ uri: openFile }}
        style={{
          width: '100%',
          height: getResponsiveHeight(80),
        }}
        controls={true}
       />
      }
    </View>
  );
};

export default OpenFile;
