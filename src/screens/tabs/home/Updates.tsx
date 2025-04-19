import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeNavbar from '../../../components/HomeNavbar'
import { COLORS } from '../../../utils/Colors'
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess'
import { IMAGES_URI } from '../../../constants/Images'
import { ICONS_URI } from '../../../constants/Icons'
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { API } from '../../../api/Api'
import { createThumbnail } from "react-native-create-thumbnail";

const Updates = ({ navigation }: any) => {
  const userId = API.userId

  const names = {
    'Taqi Usmani': IMAGES_URI.codingGroup,
    'Elon Musk': IMAGES_URI.codingGroup,
    'CNN News': IMAGES_URI.codingGroup,
    'Olypmics': IMAGES_URI.codingGroup,
    'Zukerberg': IMAGES_URI.codingGroup,
    'Football': IMAGES_URI.codingGroup,
    'Ronaldo': IMAGES_URI.codingGroup,
    'Programming': IMAGES_URI.codingGroup,
    'Geo News': IMAGES_URI.codingGroup,
    'E-commerce': IMAGES_URI.codingGroup,
    'Imran Khan': IMAGES_URI.codingGroup,
    'Smaa News': IMAGES_URI.codingGroup,
  };
  const images = {
    'Taqi Usmani': IMAGES_URI.codingGroup,
    'Elon Musk': IMAGES_URI.codingGroup,
    'CNN News': IMAGES_URI.codingGroup,
    'Olypmics': IMAGES_URI.codingGroup,
    'Zukerberg': IMAGES_URI.codingGroup,
    'Football': IMAGES_URI.codingGroup,
    'Ronaldo': IMAGES_URI.codingGroup,
    'Programming': IMAGES_URI.codingGroup,
    'Geo News': IMAGES_URI.codingGroup,
    'E-commerce': IMAGES_URI.codingGroup,
    'Imran Khan': IMAGES_URI.codingGroup,
    'Smaa News': IMAGES_URI.codingGroup,
  };

  const [temporaryStatus, setTemporaryStatus] = useState<any>(null);
  const [uploadedStatus, setUploadedStatus] = useState<any>(null);


  const uploadStatus = async () => {
    const options: any = {
      mediaType: 'mixed',
      selectionLimit: 1,
    };
  
    launchImageLibrary(options, async (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled the image picker');
        return;
      }
  
      if (response.errorCode) {
        console.log('Error:', response.errorMessage);
        return;
      }
  
      const selectedAsset: any = response.assets[0];
      console.log('Selected File URI:', selectedAsset.uri);
      setTemporaryStatus({ uri: selectedAsset.uri });
  
      const fileType = selectedAsset.type === 'video/mp4' ? 'video' : 'image';
  
      try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('mediaType', fileType);
  
        if (fileType === 'video') {
          const thumbnailResponse = await createThumbnail({
            url: selectedAsset.uri,
            timeStamp: 1000,
          });
  
          console.log('Thumbnail Path:', thumbnailResponse.path);
          formData.append('thumbnail', {
            uri: thumbnailResponse.path,
            name: 'thumbnail.jpg',
            type: 'image/jpeg',
          });
        }
  
        formData.append('status', {
          uri: selectedAsset.uri,
          name: selectedAsset.fileName || 'status',
          type: selectedAsset.mediaType || 'image/jpeg',
        });
  
        console.log('Form Data:', formData);
  
        const uploadResponse = await axios.post(`${API.BASE_URI}/status/uploadStatus`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload Response:', uploadResponse.data.data);
      } catch (err) {
        console.error('Error uploading status:', err);
      }
    });
  };

  const retrieveStatus = async () => {
    try {
      const response = await axios.get(`${API.BASE_URI}/status/${API.userId}`);
      const statusData = response.data.data;
  
      if (statusData.length > 0) {
        console.log('statusDtat:', statusData)
        const lastStatus = statusData[statusData.length - 1];
        console.log('lastStau:', lastStatus)

        const mediaType = lastStatus.mediaType;
        console.log('mediaType:', mediaType)

        const mediaUrl = lastStatus.mediaUrl;
        console.log('mediaUrl:', mediaUrl)

        const thumbnail = lastStatus.thumbnail;
        console.log('thumbnail:', thumbnail)

  
        if (mediaType === 'video') {
          setUploadedStatus({ uri: thumbnail });
        } else {
          setUploadedStatus({ uri: mediaUrl });
        }
  
        console.log('Last Status Media Type:', mediaType);
      } else {
        console.log('No status available');
        setUploadedStatus(null);
      }
    } catch (err) {
      console.error('Error retrieving status:', err);
      setUploadedStatus(null);
    }
  };

  useEffect(() => {
    retrieveStatus();
  }, []);

  const statusToDisplay = temporaryStatus || uploadedStatus;
  const statusToDisplay2 = ICONS_URI.User

  const viewStatusORUpload = () => {
    Alert.alert("Status",
      "Upload Status or View Status",
      [
        {
          text: "Upload",
          onPress: uploadStatus,
        },
        {
          text: "View",
          onPress: () => navigation.navigate('ViewStatus'),

        }
      ],
      { cancelable: true }
    )
  }

  return (
    <>
      <HomeNavbar
        extraStyle={{ fontWeight: '400', colors: COLORS.black, fontSize: getResponsiveFontSize(22), }}
        title={'Updates'}
      />
      <ScrollView style={styles.mainScrollView}>
        {/* Status */}
        <ScrollView horizontal={true} style={styles.allStatus} showsHorizontalScrollIndicator={false}>
          <View style={styles.myStatus}>
            <Text style={{ fontSize: getResponsiveFontSize(18), color: COLORS.black, marginTop: getResponsiveHeight(1) }}>Status</Text>

            <TouchableOpacity onPress={!statusToDisplay ? uploadStatus : viewStatusORUpload} style={styles.status}>
            <Image
                style={[statusToDisplay ? styles.image : styles.image2]}
                source={statusToDisplay ? statusToDisplay : statusToDisplay2}
              />

            </TouchableOpacity>

            <Text style={{ fontSize: getResponsiveFontSize(12), top: getResponsiveHeight(-1), color: COLORS.black }}>My Status</Text>
          </View>

          {Object.keys(names).map((key, index) => (
            <View key={index} style={styles.friendsStatus}>
              <View style={styles.fStatus}>
                <Image style={styles.image} source={images[key]} />
              </View>
              <Text style={{ fontSize: getResponsiveFontSize(12), top: getResponsiveHeight(-1), color: COLORS.black }}>{key}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Channels */}
        <View style={styles.channels}>
          <View style={styles.channelsExplore}>
            <Text style={{ fontSize: getResponsiveFontSize(22), color: COLORS.black, left: getResponsiveWidth(4) }}>Channels</Text>
            <Text style={{ fontSize: getResponsiveFontSize(16), color: COLORS.black, right: getResponsiveWidth(4) }}>Explore</Text>
          </View>
          <View style={styles.groupOne}>
            <Image style={styles.channelImages} source={IMAGES_URI.adamjeeGroup} />
            <View style={styles.channelNameMessage}>
              <Text style={{ fontSize: getResponsiveFontSize(19), color: COLORS.black, fontFamily: 'bold' }}>AGSC Karachi</Text>
              <Text style={{ fontSize: getResponsiveFontSize(11), color: COLORS.black, lineHeight: getResponsiveHeight(3.5), top: -5 }}>Exams DateSheet</Text>
            </View>
          </View>
          <View style={styles.groupOne}>
            <Image style={styles.channelImages} source={IMAGES_URI.ecommerceGroup} />
            <View style={styles.channelNameMessage}>
              <Text style={{ fontSize: getResponsiveFontSize(19), color: COLORS.black, fontFamily: 'bold' }}>Shopping  E - commerce</Text>
              <Text style={{ fontSize: getResponsiveFontSize(11), color: COLORS.black, lineHeight: getResponsiveHeight(3.5), top: -5 }}>New Products of Amazon</Text>
            </View>
          </View>
          <View style={styles.groupOne}>
            <Image style={styles.channelImages} source={IMAGES_URI.codingGroup} />
            <View style={styles.channelNameMessage}>
              <Text style={{ fontSize: getResponsiveFontSize(19), color: COLORS.black, fontFamily: 'bold' }}>Senior Programmers</Text>
              <Text style={{ fontSize: getResponsiveFontSize(11), color: COLORS.black, lineHeight: getResponsiveHeight(3.5), top: -5 }}>JavaScript latest updates</Text>
            </View>
          </View>
          {/* Find Channels */}
          <View style={styles.findChannelsContainer}>
            <Text style={styles.findText}>Find channels</Text>
            <ScrollView style={styles.findChannelsScrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
              {Object.keys(images).map((key, index) => (
                <View key={index} style={styles.singleChannel}>
                  <View style={styles.channelsImage}>
                    <Image style={styles.image} source={images[key]} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize(15), fontWeight: '400', marginTop: 5, color: COLORS.black }}>{key}</Text>
                  <TouchableOpacity style={styles.followButton}>
                    <Text>Follow</Text>
                  </TouchableOpacity>
                </View>
              ))}

            </ScrollView>
          </View>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={{ color: 'white' }}>Explore more</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.penCamera}>
        <View style={styles.penView}>
          <Image style={{ height: 25, resizeMode: 'contain' }} source={ICONS_URI.pen} />
        </View>
        <View style={styles.cameraView}>
          <Image source={ICONS_URI.camera} />
        </View>
      </View>
    </>
  )
}

export default Updates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScrollView: {
    width: '100%',
    backgroundColor: COLORS.white

  },
  allStatus: {
    height: getResponsiveHeight(20),
    flexDirection: 'row',
    paddingHorizontal: 2,

  },
  myStatus: {
    width: getResponsiveHeight(11),
    height: getResponsiveHeight(18.8),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 2,

  },
  status: {
    width: getResponsiveHeight(8),
    height: getResponsiveHeight(8),
    backgroundColor: COLORS.white,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsStatus: {
    width: getResponsiveHeight(10),
    height: getResponsiveHeight(19),
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 2,

  },
  fStatus: {
    width: getResponsiveHeight(8),
    height: getResponsiveHeight(8),
    backgroundColor: 'white',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
    top: getResponsiveHeight(-2.3),
  },
  image: {
    width: getResponsiveHeight(7),
    height: getResponsiveHeight(7),
    borderRadius: 100,
    resizeMode: 'cover',
    // tintColor: COLORS.darkGreen

  },
  image2: {
    width: getResponsiveHeight(7),
    height: getResponsiveHeight(7),
    borderRadius: 100,
    resizeMode: 'cover',
    tintColor: COLORS.gray

  },
  channels: {
    width: '100%',
    height: 780,
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
    marginTop: 5,
    paddingTop: 20,

  },
  channelsExplore: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  groupOne: {
    width: '100%',
    height: getResponsiveHeight(8),
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',

  },
  channelImages: {
    width: getResponsiveHeight(6.5),
    height: getResponsiveHeight(6.5),
    borderRadius: 100,
    left: 10,
  },
  channelNameMessage: {
    marginTop: getResponsiveWidth(2),
    marginLeft: getResponsiveWidth(7.5),
  },
  findText: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '400',
    left: getResponsiveWidth(4),
    top: getResponsiveWidth(4),
    color: COLORS.black

  },
  findChannelsScrollView: {
    width: '100%',
    padding: 10,
    top: getResponsiveHeight(3),
  },
  singleChannel: {
    width: getResponsiveWidth(33),
    height: getResponsiveHeight(22),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: getResponsiveWidth(3),
    alignItems: 'center',
    gap: 10,
  },
  channelsImage: {
    width: getResponsiveHeight(8),
    height: getResponsiveHeight(8),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveWidth(4),
  },
  followButton: {
    width: getResponsiveHeight(9),
    height: getResponsiveHeight(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGreen,
    borderRadius: 100,
  },
  exploreButton: {
    width: getResponsiveWidth(28),
    height: getResponsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    marginTop: getResponsiveWidth(10),
    marginLeft: getResponsiveWidth(5)
  },
  penCamera: {
    position: 'absolute',
    width: 80,
    height: 125,
    bottom: 20,
    right: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  penView: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#eae6df',

    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});