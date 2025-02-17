import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreensNavbar from '../../../components/ScreensNavbar';
import { COLORS } from '../../../utils/Colors';

const ViewProfile = ({navigation, route}:any) => {
    const {profile} = route.params;
    console.log('profile:', profile);

    return (
       <>
       <ScreensNavbar text='Profile' /> 
         <View style={styles.container}>
            <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri: profile}} /> 
            </View>
       </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightBlack,
    },
});

export default ViewProfile;
