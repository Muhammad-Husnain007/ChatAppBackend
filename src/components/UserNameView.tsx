import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ICONS_URI } from '../constants/Icons';
import { COLORS } from '../utils/Colors';
import { getResponsiveHeight, getResponsiveWidth } from '../utils/ResponsiveNess';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../api/Api';

const SwipeableList = () => {
    const navigation: any = useNavigation();
    const [usersAdded, setUsersAdded] = useState([]);
    const userId = API.userId;
    const authToken = API.authToken;

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API.BASE_URI}/user/${userId}`);
                const contacts = response.data.data.contacts;
                const filteredContacts = contacts.filter((contact:any) => contact.exists === true);
                setUsersAdded(filteredContacts);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch contacts. Please try again later.');
            }
        };

        getData();
    }, [userId, authToken]);

    // Render each contact item
    const renderItem = ({ item }: any) => {
        console.log('items::', item.contact.firstName)
       return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('OpenChat', { contactId: item.id })}
            style={styles.container}
        >
            <View style={styles.profileImage}>
                <Image style={styles.image} source={ICONS_URI.addUser} />
            </View>
            <View style={{flexDirection: 'row', gap: 10}}>
                <Text style={styles.userName}>{item.contact.firstName}</Text>
                <Text style={styles.userName}>{item.contact.lastName}</Text>
            </View>
        </TouchableOpacity>
    )};



    return (
        <>
        <SwipeListView
            data={usersAdded}
            renderItem={renderItem}
            // renderHiddenItem={renderHiddenItem}
            rightOpenValue={-160}
            disableRightSwipe
            keyExtractor={(item: any) => item.id}
            // onRowOpen={(rowKey, rowMap) => {
            //     setTimeout(() => {
            //         rowMap[rowKey]?.closeRow();
            //         deleteItem(rowKey);
            //     }, 7000); 
            // }}
        />
    </>

    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: getResponsiveWidth(2),
        backgroundColor: '#f8f8f8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 2,
        gap: 20
    },
    gradientButton: {
        width: 75,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    profileImage: {
        width: 64,
        height: 64,
        borderRadius: 100,
        backgroundColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    userName: {
        fontSize: 16,
        color: '#000',
        marginBottom: 2,
    },
    message: {
        fontSize: 12,
        color: '#007bff',
    },
    hiddenContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',

    },
    deleteButton: {
        width: '20%',
        height: getResponsiveHeight(9),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: COLORS.primary,
        right: getResponsiveWidth(0),
        opacity: 0.8, borderRadius: 10
    },
    archiveButton: {
        width: '20%',
        height: getResponsiveHeight(9),
        justifyContent: 'center',
        alignItems: 'center',
        left: getResponsiveWidth(2),
        opacity: 0.8, borderRadius: 10
    },
    hiddentImage: {
       width: getResponsiveWidth(5),
       height: getResponsiveWidth(5),
       tintColor: COLORS.black
    },
});

export default SwipeableList;


// //     const deleteItem = (rowKey) => {
//         // const newData = data.filter((item) => item.id !== rowKey);
//         // setData(newData);
//     };

//     const confirmDelete = (rowKey) => {
//         // Alert.alert(
//         //   'Confirm Delete',
//         //   'Are you sure you want to delete this item?',
//         //   [
//         //     { text: 'Cancel', style: 'cancel' },
//         //     { text: 'Delete', style: 'destructive', onPress: () => deleteItem(rowKey) },
//         //   ],
//         //   { cancelable: true }
//         // );
//     };
//     const archiveItem = () => {

//     }
//     const renderHiddenItem = ({ item }) => (
//         <View style={styles.hiddenContainer}>


//             <TouchableOpacity
//                 style={styles.archiveButton}
//                 onPress={() => confirmDelete(item.id)}
//             >
//                 <LinearGradient
//                     colors={[COLORS.lightWhite, COLORS.primary]}
//                     style={styles.gradientButton}
//                 >
//                     <Image style={styles.hiddentImage} source={ICONS_URI.archive} />
//                 </LinearGradient>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => archiveItem(item.id)}
//             >
//                 <LinearGradient
//                     colors={[COLORS.lightWhite, COLORS.primary]}
//                     style={styles.gradientButton}
//                 >
//                     <Image style={styles.hiddentImage} source={ICONS_URI.delete} />
//                 </LinearGradient>
//             </TouchableOpacity>
//         </View>
//     );