import { View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Video from "react-native-video";
import { COLORS } from "../../../utils/Colors";
import { getResponsiveHeight } from "../../../utils/ResponsiveNess";

type RouteParams = {
  route: {
    params: {
      openFile: string;
      type: string;
    };
  };
};

const OpenFile: React.FC<RouteParams> = ({ route }) => {
  const { openFile, type } = route.params;
  const [paused, setPaused] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {type === "image" ? (
        <Image
          source={{ uri: openFile }}
          style={{
            width: "100%",
            height: getResponsiveHeight(50),
            resizeMode: "contain",
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setPaused(!paused)}
            style={{
              width: "100%",
              height: getResponsiveHeight(80),
              position: "absolute",
              zIndex: 1,
            }}
          />
          <Video
            source={{ uri: openFile }}
            style={{
              width: "100%",
              height: getResponsiveHeight(80),
            }}
            paused={paused}
            resizeMode="contain"
            controls={true}
          />
        </>
      )}
    </View>
  );
};

export default OpenFile;
