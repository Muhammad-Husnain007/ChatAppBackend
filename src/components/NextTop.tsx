import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../utils/Colors'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess'
import UsersChats from './onhome/AllChats'
import AllChats from './onhome/AllChats'
import Unread from './onhome/Unread'
import Favourite from './onhome/Favourite'
import Groups from './onhome/Groups'
import AddMore from './onhome/AddMore'

const NextTop = () => {
    const [handle, setHandle] = useState(0)

console.log(handle)
    return (
        <>
            <View style={{
                width: '100%', height: getResponsiveHeight(7), backgroundColor: '#f8f8f8', flexDirection: 'row',
                paddingVertical: getResponsiveHeight(2), paddingHorizontal: getResponsiveHeight(2)
                , gap: 10
            }}>
               
                    <TouchableOpacity onPress={() => setHandle(0)} style={{paddingHorizontal: getResponsiveWidth(5), height: getResponsiveHeight(4), justifyContent: 'center', borderRadius: 100, backgroundColor: COLORS.lightGray }}>
                        <Text style={{ fontSize: getResponsiveFontSize(10), fontWeight: '500', color: COLORS.black, alignSelf: 'center' }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setHandle(1)} style={{ paddingHorizontal: getResponsiveWidth(2.5), height: getResponsiveHeight(4), justifyContent: 'center', borderRadius: 100, backgroundColor: COLORS.lightGray }}>
                        <Text style={{ fontSize: getResponsiveFontSize(10), fontWeight: '500', color: COLORS.black, alignSelf: 'center' }}>Unread</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setHandle(2)} style={{paddingHorizontal: getResponsiveWidth(2.5), height: getResponsiveHeight(4), justifyContent: 'center', borderRadius: 100, backgroundColor: COLORS.lightGray }}>
                        <Text style={{ fontSize: getResponsiveFontSize(10), fontWeight: '500', color: COLORS.black, alignSelf: 'center' }}>Favourites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setHandle(3)} style={{ paddingHorizontal: getResponsiveWidth(2.5), height: getResponsiveHeight(4), justifyContent: 'center', borderRadius: 100, backgroundColor: COLORS.lightGray }}>
                        <Text style={{ fontSize: getResponsiveFontSize(10), fontWeight: '500', color: COLORS.black, alignSelf: 'center' }}>Groups</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setHandle(4)} style={{paddingHorizontal: getResponsiveWidth(2.5), height: getResponsiveHeight(4), justifyContent: 'center', borderRadius: 100, backgroundColor: COLORS.lightGray }}>
                        <Text style={{ fontSize: getResponsiveFontSize(10), fontWeight: '500', color: COLORS.black, alignSelf: 'center' }}>Add</Text>
                    </TouchableOpacity>
           

            </View>
            
               {
                handle === 0 ? <AllChats /> : handle === 1 ? <Unread /> : handle === 2 ? <Favourite />
                : handle === 3 ? <Groups /> : <AddMore />
               }

        </>
    )
}

export default NextTop