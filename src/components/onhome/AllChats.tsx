import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import io from 'socket.io-client'
import { API } from '../../api/Api'
import { ICONS_URI } from '../../constants/Icons'
import { getResponsiveWidth } from '../../utils/ResponsiveNess'

const AllChats = () => {
    const navigation: any = useNavigation();
    const [usersAdded, setUsersAdded] = useState([]);
    const userId = API.userId;
    const authToken = API.authToken;
    const socket:any = useRef(null);

    useEffect(() => {
        console.log('Initializing Socket Connection...');
        socket.current = io(`${API.BASE_URI}`); 

        socket.current.on('connect', () => {
            console.log('✅ Connected to socket server:', socket.current.id);
            socket.current.emit('getContacts', userId);
        });

        socket.current.on('contactsUpdated', (data: any) => {
            console.log('📢 Contacts Updated Event:', data);
            if (Array.isArray(data)) {
                setUsersAdded(data);
            }
        });

        return () => {
            socket.current.disconnect();
            console.log('❌ Disconnected from socket server');
        };
    }, []);   

    useEffect(() => {
      const getData = async () => {
        if (!userId || !authToken) return;
    
        try {
          const response = await axios.get(`${API.BASE_URI}/user/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
  
          const contacts = response.data.data.contacts.contactsSaved;
          console.log('Fetched Contacts:', contacts);
  
          const filteredContacts = contacts.filter((contact: any) => contact.exists === true);
          console.log('Filtered Contacts:', filteredContacts); 
  
          setUsersAdded(filteredContacts);
        } catch (error) {
          console.log('Failed to fetch contacts:', error);
        }
      };
    
      getData();
  }, [userId, authToken]);
  

    const handleCreateChat = async(item: any) => {
        try {
            console.log('📝 Creating Chat for:', item.contact?.user?.[0]?._id);
            const participant2 = item.contact.user[0]._id;
            const participants = [userId, participant2];

            const existingChat = await axios.post(`${API.BASE_URI}/chat/createChat`, {
                participants: participants
            });

            console.log('✅ Chat Created Successfully:', existingChat.data);
        
            navigation.navigate('OpenChat', { 
                contactId: participant2,
                firstName: item.contact.firstName,
                lastName: item.contact.lastName,
                chatId: existingChat.data.data._id,
            });

        } catch (error) {
            console.log('❌ Error Creating Chat:', error);
        }
    };

    const renderItem = ({ item }: any) => {
        const firstName = item?.contact?.firstName || 'Unknown';
        const lastName = item?.contact?.lastName || 'User';
        console.log('👤 Rendering Contact:', item);

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleCreateChat(item)}
                style={styles.container}
                key={item._id || item.id}
            >
                <View style={styles.profileImage}>
                    <Image style={styles.image} source={ICONS_URI.addUser} />
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={styles.userName}>{firstName}</Text>
                    <Text style={styles.userName}>{lastName}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <SwipeListView
                data={usersAdded}
                renderItem={renderItem}
                rightOpenValue={-160}
                disableRightSwipe
                keyExtractor={(item: any) => item._id || item.id}
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
    }
});

export default AllChats;
