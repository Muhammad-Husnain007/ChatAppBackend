import { View, Text, Image } from 'react-native'
import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Chats from '../screens/tabs/home/Chats'
import Updates from '../screens/tabs/home/Updates'
import Communities from '../screens/tabs/home/Communities'
import Calls from '../screens/tabs/home/Calls'
import { ICONS_URI } from '../constants/Icons'
import { COLORS } from '../utils/Colors'
import { getResponsiveFontSize, getResponsiveHeight } from '../utils/ResponsiveNess'

const BottomTabs = createBottomTabNavigator()
const BottomNavigation = () => {
  return (
    <BottomTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      
      tabBarStyle: {
        height: getResponsiveHeight(8.5),
        backgroundColor: COLORS.secondary,
        paddingTop: 5, 
      },
      tabBarLabelStyle: { fontSize: getResponsiveFontSize(10), color: COLORS.black, top: getResponsiveHeight(0.8) },
      tabBarIcon: ({ focused }) => {
        const getIcon = () => {
          if (route.name === 'Chats') {
            return ICONS_URI.comment;
          } else if (route.name === 'Updates') {
            return ICONS_URI.status;
          } else if (route.name === 'Communities') {
            return ICONS_URI.bottomGroup;
          } else if (route.name === 'Calls') {
            return ICONS_URI.greenCall;
          }
        };
  
        return (
          <View
            style={{
              width: getResponsiveHeight(7),
              height: getResponsiveHeight(3.8),
              borderRadius: getResponsiveHeight(1), 
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: focused ? COLORS.lightGreen : 'transparent', 
            }}
          >
            <Image
              style={{
                tintColor: COLORS.primary, 
                width: getResponsiveHeight(3),
                height: getResponsiveHeight(3),
              }}
              source={getIcon()}
            />
          </View>
        );
      },
    })}
  >
        <BottomTabs.Screen name='Chats' component={Chats} />
        <BottomTabs.Screen name='Updates' component={Updates} />
        <BottomTabs.Screen name='Communities' component={Communities} />
        <BottomTabs.Screen name='Calls' component={Calls} />
    </BottomTabs.Navigator>
  )
}

export default BottomNavigation