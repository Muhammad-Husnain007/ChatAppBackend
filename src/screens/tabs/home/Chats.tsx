import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, StyleSheet, Alert, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native'; // Import isFocused
import HomeNavbar from '../../../components/HomeNavbar';
import SearchSection from '../../../components/SearchSection';
import NextTop from '../../../components/NextTop';
import { COLORS } from '../../../utils/Colors';
import { getResponsiveWidth } from '../../../utils/ResponsiveNess';
import { ICONS_URI } from '../../../constants/Icons';

const Chats = ({ navigation }: any) => {
  const isFocused = useIsFocused(); // Check if this screen is active

  useEffect(() => {
    if (!isFocused) return; // Only apply back handler if this screen is active

    const backAction = () => {
      Alert.alert('Exit App', 'Do you want to exit the app?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Remove handler when leaving screen
  }, [isFocused]);

  return (
    <>
      <HomeNavbar title={'ChatApp'} />
      <FlatList
        style={{ backgroundColor: COLORS.white }}
        ListHeaderComponent={() => (
          <>
            <SearchSection />
            <NextTop />
          </>
        )}
      />
      <View style={styles.penCamera}>
        <TouchableOpacity onPress={() => navigation.navigate('AddContact')} style={styles.cameraView}>
          <Image style={{ width: getResponsiveWidth(7), height: getResponsiveWidth(7), resizeMode: 'contain' }} source={ICONS_URI.comment} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Chats;

const styles = StyleSheet.create({
  penCamera: {
    position: 'absolute',
    width: '20%',
    bottom: getResponsiveWidth(5),
    right: getResponsiveWidth(4),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraView: {
    width: getResponsiveWidth(14),
    height: getResponsiveWidth(14),
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
});
