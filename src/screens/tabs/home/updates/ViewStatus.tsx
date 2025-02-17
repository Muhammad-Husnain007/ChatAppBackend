import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { ICONS_URI } from '../../../../constants/Icons';
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../../utils/ResponsiveNess';
import BottomModal from '../../../../components/modals/BottomModal';
import { COLORS } from '../../../../utils/Colors';
import axios from 'axios';
import { API } from '../../../../api/Api';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const ViewStatus = () => {
  const [statusUris, setStatusUris] = useState<[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0); 
  // console.log('video duration:', videoDuration);
  const progressRefs: any = useRef([]);
  const isAnimationRunning = useRef(false);
  const navigation = useNavigation();
  const [isPaused, setIsPaused] = useState(false); // for video


  useEffect(() => {
    retrieveStatus();
  }, []);

  useEffect(() => {
    if (statusUris.length > 0 && !isAnimationRunning.current) {
      startProgress(currentIndex);
    }
  }, [currentIndex, statusUris]);

  useEffect(() => {
    if (videoDuration > 0 && statusUris[currentIndex]?.type === 'video') {
      startProgress(currentIndex);
      setIsPaused(false)
      
    }
  }, [videoDuration]); 

  const startProgress = (index) => {
    if (index >= statusUris.length) {
      return;
    }
  
    isAnimationRunning.current = true;
    setIsPaused(false);
  
    if (!progressRefs.current[index]) {
      progressRefs.current[index] = new Animated.Value(0);
    } else {
      progressRefs.current[index].setValue(0);
    }
  
    let duration = statusUris[index]?.type === 'video' ? videoDuration || 3000 : 5000;
    // console.log('Yeh rahii duration', duration);
  
    Animated.timing(progressRefs.current[index], {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        isAnimationRunning.current = false;
        goToNextStatus();
      }
    });
  
    // 🔹 Force re-render to update UI
    setTimeout(() => {
      setIsPaused(false);  // Ensure UI updates
    }, 100);
  };
  

  const pauseProgress = () => {
    if (progressRefs.current[currentIndex]) {
      progressRefs.current[currentIndex].stopAnimation();
      isAnimationRunning.current = false;
      setIsPaused(true)
    }
  };

  const resumeProgress = () => {
    if (progressRefs.current[currentIndex]) {
      const currentValue = progressRefs.current[currentIndex]._value;
      isAnimationRunning.current = true;
      setIsPaused(false)      
      Animated.timing(progressRefs.current[currentIndex], {
        toValue: 1,
        duration: (1 - currentValue) * videoDuration,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          isAnimationRunning.current = false;
          goToNextStatus();
        }
      });
    }
  };

  const goToNextStatus = () => {
    if (currentIndex < statusUris.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const retrieveStatus = async () => {
    try {
      const response = await axios.get(`${API.BASE_URI}/status/${API.userId}`);
      const statuses = response.data.data.map((x) => ({
        uri: x.mediaUrl,
        type: x.mediaType,
      }));
      setStatusUris(statuses);
      progressRefs.current = statuses.map(() => new Animated.Value(0));
    } catch (err) {
      console.error('Error retrieving status:', err);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.progressContainer}>
  {statusUris.map((_, index) => (
    <View key={index} style={styles.progressBarContainer}>
     <Animated.View
  style={{
    ...styles.progressBar,
    width: progressRefs.current[index]
      ? progressRefs.current[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        })
      : '0%',  // ✅ Ensure a valid default value
  }}
/>
    </View>
  ))}
</View>

      <View style={styles.userInfoView}>
        <Image style={styles.userImage} source={ICONS_URI.User} />
        <Text style={styles.userName}>My Status</Text>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.statusTouchable}
        onPress={() => startProgress(currentIndex)}
        onLongPress={pauseProgress}
        onPressOut={resumeProgress}
      >
        {statusUris.length > 0 ? (
          statusUris[currentIndex]?.type === 'image' ? (
            <Image source={{ uri: statusUris[currentIndex].uri }} style={styles.statusImage} />
          ) : (
            <Video
              source={{ uri: statusUris[currentIndex].uri }}
              style={styles.statusVideo}
              resizeMode="contain"
              onLoad={async (data) => {
                const durationMs = data.duration * 1000;
                console.log('data:', durationMs);
                if (durationMs > 30000) {
                  await setVideoDuration(30000);
                } else {
                  await setVideoDuration(durationMs);
                }
              }}
              onEnd={goToNextStatus}
              controls={false}
              repeat={false}
              paused={isPaused}
            />
          )
        ) : (
          <Text style={{ color: 'white' }}>No statuses available</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ViewStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B4B4B',
  },
  userInfoView: {
    width: '100%',
    height: getResponsiveHeight(10),
    alignItems: 'center',
    gap: getResponsiveHeight(3),
    top: getResponsiveHeight(2),
    flexDirection: 'row',
    paddingLeft: getResponsiveHeight(3),
  },
  userImage: {},
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  userName: {
    fontSize: getResponsiveFontSize(18),
    color: COLORS.white,
    fontWeight: '500',
  },
  statusTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  statusImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
    top: getResponsiveHeight(-2),
  },
  statusVideo: { width: '100%', height: '80%' },
});