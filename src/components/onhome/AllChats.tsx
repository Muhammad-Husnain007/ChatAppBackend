import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import io from 'socket.io-client'
import { API } from '../../api/Api'
import { ICONS_URI } from '../../constants/Icons'
import { getResponsiveFontSize, getResponsiveWidth } from '../../utils/ResponsiveNess'
import { useContacts } from '../../hooks/UseContext'
import App from '../../../App'
import { COLORS } from '../../utils/Colors'

const AllChats = () => {
    const navigation: any = useNavigation();
    const userId = API.userId;
    const authToken = API.authToken;
    const socket:any = useRef(null);
    const { usersAdded, setUsersAdded, contactsProfile, setContactsProfile } = useContacts();
    // const [contactsId, setContactsId] = useState<any>([]);

    // Connect Socket Server

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

// Retrive Contacts

    useEffect(() => {
        const getData = async () => {
          if (!userId || !authToken) return;
      
          try {
            // 🟩 Get user by ID
            const response = await axios.get(`${API.BASE_URI}/user/${userId}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
      
            const contacts = response.data.data.contacts.contactsSaved;
            const filteredContacts = contacts.filter((contact: any) => contact.exists === true);
      
            // 🟩 Get not saved contacts
            const notSavedResponse = await axios.get(`${API.BASE_URI}/contact/contactNotSaved/${userId}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
      
            const filteredContacts2 = notSavedResponse.data.data; // Just the array of contacts
            console.log('filteredContacts2:', filteredContacts2);
           
            setUsersAdded([...filteredContacts, ...filteredContacts2]);
      
          } catch (error) {
            console.log('Failed to fetch contacts:', error);
          }
        };
      
        getData();
      }, [userId, authToken]);
      
    //   Retrive Profiles
  
  useEffect(() => { 
    const getProfile = async () => {
    const response = await axios.get(`${API.BASE_URI}/profile/receiveContactsProfiles/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },      
    })
    const profiles = response.data.data[0].flatMap((item: any) => item.profile);
    console.log('🔍 Profiles:', response.data);
    setContactsProfile(profiles);

}
   getProfile();
    }, [userId,authToken]);

    // For chat creation b/w 2 users
    
    const handleCreateChat = async (item: any) => {
        try {
          // 🔐 Get contactNotSaved list from server
          const response = await axios.get(`${API.BASE_URI}/contact/contactNotSaved/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
      
          const notSavedList = response.data.data; // Array of contacts
          let participant2;
      
          // 🔍 Try to get participant2 from contact (if saved)
          if (item.contact?.user && Array.isArray(item.contact.user)) {
            participant2 = item.contact.user[0]?.toString();
          }
      
          // 🔄 Fallback: If not saved, try from notSavedList
          if (!participant2 && notSavedList.length > 0) {
            const matched = notSavedList.find(entry => entry._id === item._id || entry.phoneNumber === item.phoneNumber);
            if (matched) {
              participant2 = matched.sender?.toString();
            }
          }
      
          // ❌ No participant found, exit
          if (!participant2) {
            throw new Error("Contact user not found");
          }
      
          // ✅ Format participants array correctly
          const participants = [userId, participant2];
      
          // 📨 Create or fetch chat from backend
          const existingChat = await axios.post(`${API.BASE_URI}/chat/createChat`, {
            participants: participants,
          });
      
          // 🖼️ Get profile image for navigation
          const contactProfile =
            item?.contact?.displayProfile?.[0]?.profile ||
            item?.displayProfile?.[0]?.profile ||
            null;
      
          // 🔁 Navigate to OpenChat screen
          navigation.navigate('OpenChat', {
            contactId: participant2,
            firstName: item?.contact?.firstName || item?.phoneNumber,
            lastName: item?.contact?.lastName || '',
            chatId: existingChat.data.data._id,
            contactProfile,
          });
        } catch (error) {
          console.log('❌ Server Error Creating Chat:', error.response?.data || error.message);
        }
      };
      
    
    const renderItem = ({ item }: any) => {
        const firstName = item?.contact?.firstName || item.phoneNumber;
        const lastName = item?.contact?.lastName || '';
        const profiles = item?.contact?.displayProfile || item?.displayProfile;
        const defaultUserIcon = ICONS_URI.User;
        console.log('profiles:', profiles);
    
        return (
            <View style={{ width: '100%', top: 10 }}>       
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleCreateChat(item)}
                    style={styles.container}
                    key={item._id || item.id}
                >
                    {/* ✅ Agar profiles available hain toh show karo, warna default icon */}
                    {profiles?.length > 0 ? (
                        profiles.slice(0, 2).map((profile: any, index: number) => (
                            <View key={index} style={styles.profileImage}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: profile.profile }}
                                />
                            </View>
                        ))
                    ) : (
                        <View style={styles.profileImage}>
                            <Image
                                style={styles.image}
                                source={defaultUserIcon}
                            />
                        </View>
                    )}
    
                    <View>
                        <View style={{flexDirection: 'row', width: '87%', justifyContent: 'space-between'}}>
                        <Text style={styles.userName}>{firstName} {lastName}</Text>
                        <Text style={styles.lastMessageSendDate}>11:00 PM</Text>
                        </View>

                        <Text style={styles.lastMessage}>The last message</Text>

                    </View>


                </TouchableOpacity>
            </View>
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
        paddingVertical: getResponsiveWidth(1.5),
        // backgroundColor: '#f8f8f8',
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: getResponsiveWidth(2),
        marginBottom: 1,
        gap: getResponsiveWidth(4),
    },
    profileImage: {
        width: getResponsiveWidth(14),
        height:  getResponsiveWidth(14),
        borderRadius: 100,
        backgroundColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 100,
    },
    userName: {
        fontSize: getResponsiveFontSize(14),
        color: '#000',
        marginBottom: 2,
    },
    lastMessage: {
        fontSize: getResponsiveFontSize(12),
        color: COLORS.lightBlack,
        // marginBottom: 2,
    },
    lastMessageSendDate: {
        fontSize: getResponsiveFontSize(10),
        color: COLORS.lightBlack,
        marginBottom: 2,
    },
});

export default AllChats;
