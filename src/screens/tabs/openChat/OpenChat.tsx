import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image, Modal, Animated, PermissionsAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { IMAGES_URI } from '../../../constants/Images';
import CustomInput from '../../../components/CustomInput';
import { getResponsiveFontSize, getResponsiveHeight, getResponsiveWidth } from '../../../utils/ResponsiveNess';
import { COLORS } from '../../../utils/Colors';
import { ICONS_URI } from '../../../constants/Icons';
import ChatNavbar from '../../../components/ChatNavbar';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { API } from '../../../api/Api';
import io from 'socket.io-client'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import RNFetchBlob from "react-native-blob-util";
import FileViewer from "react-native-file-viewer";

type Message = {
  type: 'text' | 'file' | 'voice' | 'image';
  content: string;
  fileName?: string;
  fileType?: string;
  timestamp: string
};

const OpenChat = ({ navigation, route }: any) => {
  const [inputText, setInputText] = useState(''); // input text
  const [sendMessageContent, setSendMessageContent] = useState<Message[]>([]); // send message and receive
  const [userAllMessages, setUserAllMessages] = useState(new Set());
  const [retriveImagePath, setRetriveImagePath] = useState<string | null>(null); // retrive image path
  const [sendVoice, setSendVoice] = useState<boolean>(false); // send voice
  const [recordingPlay, setRecordingPlay] = useState(false); // open modal checked voice played or not
  const [durationSeconds, setDurationSeconds] = useState(0); // handle recording voice duration in seconds
  const [durationMinutes, setDurationMinutes] = useState(0); // handle recording voice duration in minutes
  const [playVoiceDuration, setPlayVoiceDuration] = useState(0); // handle recording voice duration in minutes
  const [recordedVoiceDuration, setRecordedVoiceDuration] = useState('');
  const intervalRef = useRef<any>(null); // handle for clear time and stop and play
  const [currentVoicePath, setCurrentVoicePath] = useState<string | null>(null); // for store path
  const [voicePath, setVoicePath] = useState<string | []>([]); // for store path
  const scrollViewRef = useRef<ScrollView>(null);
  const { contactId, firstName, lastName, chatId, } = route.params;
  const userId = API.userId
  const socket: any = useRef()
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;


  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage to download PDFs.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // useEffect(() => {
  //   requestAudioPermissions();
  // }, []);

  useEffect(() => {
    socket.current = io(`${API.BASE_URI}`);

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      socket.current.emit("joinChat", { chatId });
    });

    socket.current.on("receiveMessage", (newMessage: any) => {
      setSendMessageContent((prev) => [...prev, newMessage]);
      if (newMessage.senderId === userId) {
        setUserAllMessages((prev) => new Set(prev.add(newMessage._id)));
      }
    });

    return () => {
      socket.current.disconnect();
      console.log("Disconnected from socket server");
    };
  }, [chatId, userId]);

  // Receive all messages >>>>>>>>>>>>>>>>>>>>>

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API.BASE_URI}/chat/${chatId}`);
        const fetchedMessages = response.data.data.chats;
        setSendMessageContent(fetchedMessages);
        const retriveVoicePath = fetchedMessages.map(x => x.type == 'voice' ? x.mediaUrl : '')
        const retriveImagePath = fetchedMessages.map(x => x.type == 'image' ? x.mediaUrl : '')
        // console.log(fetchedMessages)
        setRetriveImagePath(retriveImagePath)
        setSendMessageContent(fetchedMessages);
        console.log("Fetched messages:", retriveVoicePath);
        setVoicePath(retriveVoicePath)

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chatId, userId]);

  const handleSendMessage = async (
    text: string,
    imagePath: { uri: string; fileName?: string; type?: string } | null = null,
    voice: string  | null = null,
    file: { uri: string; name?: string; type?: string } | null = null,
  ) => {
    console.log('voice is here:', voice);
    const currentTime: string = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let tempMessage: any = null;

    try {
      if (text) {
        tempMessage = {
          type: "text",
          content: text,
          timestamp: currentTime,
          senderId: userId,
          receiverId: contactId,
          chatId,
        };
        setSendMessageContent((prev) => [...prev, tempMessage]);

        const response = await axios.post(
          `${API.BASE_URI}/message/send/${chatId}`,
          {
            senderId: userId,
            receiverId: contactId,
            content: text,
            type: "text",
          }
        );

        const sentMessage = {
          ...tempMessage,
          _id: response.data.data._id,
          createdAt: response.data.data.createdAt,
        };

        setSendMessageContent((prev) =>
          prev.map((msg) => (msg === tempMessage ? sentMessage : msg))
        );

        socket.current.emit("sendMessage", sentMessage);
        setInputText("");
      } else if (voice) {
        tempMessage = {
          type: "voice",
          content: voice,
          timestamp: currentTime,
          senderId: userId,
          receiverId: contactId,
          chatId,
        };
        const formData = new FormData();
        formData.append("senderId", userId)
        formData.append("receiverId", contactId)
        formData.append("type", "voice")
        formData.append("voiceDuration", recordedVoiceDuration)
        formData.append("media", {
          uri: voice,
          name: "recording.mp4",
          type: "audio/mp4",
        })
        const response = await axios.post(
          `${API.BASE_URI}/message/send/${chatId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Send voice:", response.data);
        setSendMessageContent((prev) => [...prev, tempMessage]);
      } else if (imagePath) {
        tempMessage = {
          type: "image",
          content: imagePath.uri,
          timestamp: currentTime,
          senderId: userId,
          receiverId: contactId,
          chatId,
        };

        const formData = new FormData();
        formData.append("senderId", userId);
        formData.append("receiverId", contactId);
        formData.append("type", "image");
        formData.append("media", {
          uri: imagePath.uri,
          name: imagePath.fileName || "upload.jpg",
          type: imagePath.type || "image/jpeg",
        });

        const response = await axios.post(
          `${API.BASE_URI}/message/send/${chatId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Image Sent:", response.data);
        setSendMessageContent((prev) => [...prev, response.data.data]);
      } else if (file?.type === 'video/mp4') {
        tempMessage = {
          type: "video",
          content: file.uri,
          timestamp: currentTime,
          senderId: userId,
          receiverId: contactId,
          chatId,
        };

        const formData = new FormData();
        formData.append("senderId", userId);
        formData.append("receiverId", contactId);
        formData.append("type", "video");
        formData.append("media", {
          uri: file.uri,
          name: file.name || "upload.mp4",
          type: file.type || "video/mp4",
        });

        const response = await axios.post(
          `${API.BASE_URI}/message/send/${chatId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Image Sent:", response.data);
        setSendMessageContent((prev) => [...prev, response.data.data]);
      } else if (file) {
        const isPdf = file.type === "application/pdf" || file.name?.endsWith(".pdf");

        if (isPdf) {
          tempMessage = {
            type: "pdf",
            content: file.uri,
            timestamp: currentTime,
            senderId: userId,
            receiverId: contactId,
            chatId,
          };

          const formData = new FormData();
          formData.append("senderId", userId);
          formData.append("receiverId", contactId);
          formData.append("type", "pdf");
          formData.append("media", {
            uri: file.uri,
            name: file.name || `document_${Date.now()}.pdf`,
            type: "application/pdf",
          });


          const response = await axios.post(
            `${API.BASE_URI}/message/send/${chatId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("📄 PDF Sent Successfully:", response.data);
          setSendMessageContent((prev) => [...prev, response.data.data]);
        }
      }

    } catch (error) {
      console.error("Error while sending message:", error);

      if (tempMessage) {
        setSendMessageContent((prev) =>
          prev.filter((msg) => msg !== tempMessage)
        );
      }
    }
  };

  const updateTimer = () => {
    setDurationSeconds((prevSeconds) => {
      if (prevSeconds + 1 === 60) {
        setDurationMinutes((prevMinutes) => prevMinutes + 1);
        return 0;
      } else {
        return prevSeconds + 1;
      }
    });
  };

  const handleStartVoiceRecording = async () => {
    try {
      if (!recordingPlay) {
        const audioPath = `${RNFS.DocumentDirectoryPath}/recording_${Date.now()}.mp4`;
        await audioRecorderPlayer.startRecorder(audioPath);
        setCurrentVoicePath(audioPath);
        console.log('Audio path:', audioPath);
        setSendVoice(true);
        setRecordingPlay(true);
        const totalTime = intervalRef.current = setInterval(updateTimer, 1000);
        console.log(totalTime, 'is here')
      }
    } catch (error) {
      console.log('Error during start voice recording: ', error);
    }
  };

  const handlePausePlay = async () => {
    setRecordingPlay((prev) => {
      if (!prev) {
        intervalRef.current = setInterval(updateTimer, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
      return !prev;
    });
  };

  const handleSendVoice = async () => {
    try {
      if (recordingPlay) {
        const filePath: string | any = await audioRecorderPlayer.stopRecorder();
        console.log("Voice recording stopped. File path:", filePath);
        await handleSendMessage("", null, filePath);
        setRecordingPlay(false);
        setSendVoice(false);
        setVoicePath(filePath)
        clearInterval(intervalRef.current);
        setDurationSeconds(0);
        setDurationMinutes(0);
        console.log(durationMinutes, durationSeconds)
        const recordedDuration = `${String(durationMinutes).padStart(2, "")}:${String(durationSeconds).padStart(2, "0")}`;
        setRecordedVoiceDuration(recordedDuration);
      }
    } catch (error) {
      console.error("Error during sending voice message:", error);
    } finally {
      // Ensure the timer is cleared
      clearInterval(intervalRef.current);
    }
  };

  const handleDeleteRecording = async () => {
    try {
      clearInterval(intervalRef.current);
      setSendVoice(false);
      setDurationSeconds(0);
      setDurationMinutes(0);
      setRecordingPlay(false);
      setCurrentVoicePath(null);
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  const animationValues: any = useRef({});
  const [playingIndex, setPlayingIndex] = useState(null);
  const intervalIdRef: any = useRef(null);

  const VoicePlayOrNot = async (index: any) => {
    try {
      if (!animationValues.current[index]) {
        animationValues.current[index] = new Animated.Value(0);
      }

      if (playingIndex === index) {
        const stopResult = await audioRecorderPlayer.pausePlayer();
        console.log('Paused playing:', stopResult);
        setPlayingIndex(null);
        clearInterval(intervalIdRef.current);
        return;
      }

      if (playingIndex !== null) {
        const stopResult = await audioRecorderPlayer.stopPlayer();
        console.log('Stopped playing:', stopResult);
        animationValues.current[playingIndex].setValue(0);
        setPlayVoiceDuration(0);
        clearInterval(intervalIdRef.current);
        setPlayingIndex(null);
      }

      const selectedVoicePath = voicePath[index];
      
      if (!selectedVoicePath) {
        console.log('No voice path found for this index');
        return;
      }

      setCurrentVoicePath(selectedVoicePath);
      const startResult = await audioRecorderPlayer.startPlayer(selectedVoicePath);
      console.log('Playing voice:', startResult);
      setPlayingIndex(index);

      audioRecorderPlayer.removePlayBackListener();
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          animationValues.current[index].setValue(0);
          setPlayVoiceDuration(0);
          setPlayingIndex(null);
          clearInterval(intervalIdRef.current);
        } else {
          setPlayVoiceDuration(Math.floor(e.currentPosition / 1000));
        }
      });

      const [minutes, seconds] = recordedVoiceDuration
        ? recordedVoiceDuration.split(':').map(Number)
        : [0, 0];
      const totalSeconds = minutes * 60 + seconds;

      setPlayVoiceDuration(0);
      Animated.timing(animationValues.current[index], {
        toValue: 1,
        duration: totalSeconds * 1000,
        useNativeDriver: true,
      }).start(() => {
        animationValues.current[index].setValue(0);
      });

      let elapsedSeconds = 0;
      intervalIdRef.current = setInterval(() => {
        elapsedSeconds += 1;
        setPlayVoiceDuration(elapsedSeconds);

        if (elapsedSeconds >= totalSeconds) {
          clearInterval(intervalIdRef.current);
        }
      }, 1000);
    } catch (error) {
      console.error('Error during play/pause voice message:', error);
    }
  };

  const openCamera = async () => {
    try {
      const result: any = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });

      if (result.didCancel) {
        console.log('User canceled image picker');
      } else if (result.errorCode) {
        console.log('Error: ', result.errorMessage);
      } else {
        const imagePath = result.assets[0];
        console.log('Captured Image URI:', imagePath); // Debug log
        if (imagePath) {
          handleSendMessage('', imagePath);
        }
      }
    } catch (error) {
      console.log('Camera error: ', error);
    }
  };

  const openDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      if (result && result[0]) {
        const file: any = {
          uri: result[0].uri,
          name: result[0].name,
          type: result[0].type,
        };
        console.log('selected file', file)
        if (file) {
          handleSendMessage("", null, null, file);
        }
      }
    }
    catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Document not picked', error);
      }
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [sendMessageContent]);

  // Video Player

  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // pdf download

  const downloadAndOpenPdf = async (pdfUrl) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log("Storage permission denied");
        return;
      }
  
      const localFilePath = `${RNFS.DocumentDirectoryPath}/temp.pdf`;
  
      const download = RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: localFilePath,
      });
  
      await download.promise;
  
      console.log('PDF downloaded to:', localFilePath);
  
      await FileViewer.open(localFilePath, { showOpenWithDialog: true });
    } catch (error) {
      console.error('Error downloading or opening PDF:', error);
    }
  };
  

  return (
    <>
      <ChatNavbar text={`${firstName} ${lastName}`} image={true} />
      <ImageBackground source={IMAGES_URI.chatBg} style={{ width: '100%', height: '100%' }}>
        <ScrollView ref={scrollViewRef} style={{ flex: 1, paddingVertical: getResponsiveHeight(1) }}>
          {sendMessageContent.map((message: any, index) => {
            const date = new Date(message.createdAt);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            // console.log(message.mediaUrl)

            let timeFormat;
            if (hours >= 12) {
              timeFormat = 'pm'
            } else {
              timeFormat = 'am'
            }
            let zeroAdd;
            if (minutes < 10) {
              zeroAdd = '0'
            } else {
              zeroAdd = ''
            }
            const timestamps = `${hours}: ${zeroAdd}${minutes} ${timeFormat}`

            const translateX = animationValues.current[index]
              ? animationValues.current[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              })
              : 0;


            return (
              <View
                key={index}
                style={{
                  paddingVertical: getResponsiveWidth(2),
                  paddingHorizontal: getResponsiveWidth(2),
                  backgroundColor: COLORS.white,
                  marginVertical: getResponsiveWidth(1),
                  justifyContent: 'center',
                  borderRadius: 10,
                  maxWidth: '70%',
                  alignSelf: 'flex-end',
                  right: getResponsiveWidth(2),
                }}
              >
                {message.type === 'text' && (
                  <Text style={{ color: COLORS.black, fontSize: getResponsiveFontSize(14) }}>
                    {`${message.content}`}
                  </Text>
                )}

                {message.type === 'video' && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate('OpenFile', { openFile: message.mediaUrl, type: 'video' })}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: getResponsiveWidth(2),
                      backgroundColor: COLORS.lightGray,
                      padding: getResponsiveWidth(2),
                      borderRadius: 5,
                      width: '80%',
                      height: getResponsiveHeight(20),
                    }}
                  >
                    {message.mediaUrl ? (
                      <>
                        {/* Video Player */}
                        <Video
                          ref={videoRef}
                          source={{ uri: message.mediaUrl }}
                          style={{ width: "80%", height: getResponsiveHeight(18), borderRadius: 10 }}
                          resizeMode="cover"
                          paused={paused}
                          onLoad={(data) => {
                            setLoading(false);
                          }}
                          // onProgress={(progress) => setCurrentTime(progress.currentTime)}
                          onEnd={() => setPaused(true)}
                        />

                        {/* Loading Indicator */}
                        {loading && (
                          <View style={{ position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -15 }, { translateY: -15 }] }}>
                            <ActivityIndicator size="large" color="white" />
                          </View>
                        )}

                        {/* Play Button */}
                        {paused && !loading && (
                          <TouchableOpacity
                            onPress={() => (
                              navigation.navigate('OpenFile', { openFile: message.mediaUrl, type: 'video' }
                              )
                            )}
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: [{ translateX: -25 }, { translateY: -25 }],
                              backgroundColor: "rgba(0,0,0,0.5)",
                              borderRadius: 100,
                              padding: 10,
                              width: getResponsiveWidth(10),
                              alignItems: 'center'
                            }}
                          >
                            <Image source={ICONS_URI.play} style={{ tintColor: COLORS.white, width: 18, resizeMode: 'contain' }} />

                          </TouchableOpacity>
                        )}

                      </>
                    ) : (
                      <Text style={{ color: 'red' }}>Video not available</Text>
                    )}
                  </TouchableOpacity>
                )}

                {message.type === 'image' && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate('OpenFile', { openFile: message.mediaUrl, type: 'image' })}
                    style={{
                      width: '80%',
                      height: getResponsiveHeight(18),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'lightgray',
                    }}
                  >
                    {message.mediaUrl ? (
                      <Image
                        source={{ uri: message.mediaUrl }}
                        style={{
                          width: getResponsiveWidth(40),
                          height: getResponsiveHeight(20),
                          borderRadius: 5,
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <Text style={{ color: 'red' }}>Image not available</Text> // Debug message
                    )}
                  </TouchableOpacity>
                )}

                {message.type === "pdf" && (
                  <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => downloadAndOpenPdf(message.mediaUrl)}
                  style={{
                    width: "80%",
                    height: getResponsiveHeight(18),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightgray",
                  }}
                >
                
                    {message.mediaUrl ? (
                      <>
                        {/* <Pdf
                          source={{ uri: message.mediaUrl, cache: true }}
                          onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                          }}
                          onError={(error) => {
                            console.log(error);
                          }}
                          style={{
                            width: getResponsiveWidth(40),
                            height: getResponsiveHeight(20),
                          }}
                        /> */}
                           <Text style={{ color: "black" }}>Download & Open PDF</Text>

                      </>
                    ) : (
                      <Text style={{ color: "red" }}>PDF not available</Text>
                    )
                    }
                  </TouchableOpacity>
                )}

                {message.type === 'voice' && (
                  <View
                    style={{
                      width: '100%',
                      height: getResponsiveHeight(4),
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: getResponsiveWidth(8),
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => VoicePlayOrNot(index)}
                    >
                      <Image
                        source={
                          playingIndex === index ? ICONS_URI.pause : ICONS_URI.play
                        }
                        style={{ width: 24, height: 24, tintColor: COLORS.black }}
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '70%',
                        height: 1,
                        backgroundColor: 'black',
                        top: getResponsiveHeight(0.2),
                      }}
                    />
                    <Animated.View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                        backgroundColor: 'red',
                        position: 'absolute',
                        left: getResponsiveWidth(10),
                        transform: [
                          {
                            translateX: translateX || 0,
                          },
                        ],
                      }}
                    />
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: getResponsiveFontSize(10), color: COLORS.primary, marginTop: 5 }}>
                    {message.timestamp || timestamps}
                  </Text>
                  {message.type === 'voice' && (
                    <Text style={{ fontSize: getResponsiveFontSize(10), color: COLORS.primary, marginTop: 5 }}>
                      {playingIndex === index ?
                        playVoiceDuration < 60
                          ? `00:${playVoiceDuration < 10 ? `0${playVoiceDuration}` : playVoiceDuration}`
                          : `${Math.floor(playVoiceDuration / 60)
                            .toString()
                            .padStart(2, '0')}:${(playVoiceDuration % 60).toString().padStart(2, '0')}`
                        : message.voiceDuration ? message.voiceDuration : recordedVoiceDuration
                      }
                    </Text>
                  )}

                </View>

              </View>
            )
          })}
        </ScrollView>

        <View style={{ width: '100%', height: getResponsiveHeight(19) }}>
          <View
            style={{
              width: '100%',
              height: getResponsiveHeight(15),
              paddingHorizontal: 10,
              position: 'absolute',
              bottom: 20,
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <CustomInput
              inputMainStyle={{
                borderRadius: 100,
                height: getResponsiveHeight(6),
                width: '84%',
              }}
              placeholder="Send Message"
              inputStyle={{
                fontSize: getResponsiveFontSize(15),
                paddingHorizontal: 20,
              }}
              multiline={true}
              value={inputText}
              onChange={(text: string) => setInputText(text)}
            />

            <View style={{
              width: getResponsiveWidth(20), height: getResponsiveHeight(3), gap: getResponsiveWidth(6),
              position: 'absolute', right: getResponsiveWidth(20), flexDirection: 'row', top: getResponsiveHeight(1.8), zIndex: 1,
              alignItems: 'center'
            }}>
              <TouchableOpacity onPress={openDocument}>
                <Image
                  style={{
                    tintColor: COLORS.black, width: getResponsiveWidth(6), resizeMode: 'contain'
                  }}
                  source={ICONS_URI.attached}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={openCamera}>
                <Image
                  style={{
                    tintColor: COLORS.black, width: getResponsiveWidth(6), resizeMode: 'contain'
                  }}
                  source={ICONS_URI.camera}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => inputText && handleSendMessage(inputText)}
              onLongPress={handleStartVoiceRecording}
              style={{
                width: getResponsiveWidth(12),
                height: getResponsiveWidth(12),
                backgroundColor: COLORS.primary,
                borderRadius: 100,
                padding: getResponsiveWidth(3),
              }}
            >
              <Image source={inputText || sendVoice ? ICONS_URI.send : ICONS_URI.voice} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Temporary message */}

        {sendVoice && (
          <Modal transparent={true} animationType="slide">
            <View
              style={{
                width: '100%',
                position: 'absolute',
                bottom: getResponsiveHeight(1),
                height: getResponsiveHeight(20),
                backgroundColor: COLORS.white,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 20,
                  height: '50%',
                  width: '100%',
                  borderBottomWidth: 1,
                }}
              >
                <Text>{`${durationMinutes}:${durationSeconds}`}</Text>
                <Text style={{ fontSize: getResponsiveFontSize(16), color: COLORS.black }}>
                  {recordingPlay ? 'Recording' : 'Paused'}
                </Text>
                <Image style={{ width: 24, height: 24 }} source={ICONS_URI.timer} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: '50%',
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: getResponsiveWidth(12),
                    height: getResponsiveWidth(12),
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={handleDeleteRecording}
                >
                  <Image style={{ width: 24, height: 24, tintColor: 'red' }} source={ICONS_URI.delete} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePausePlay}
                  style={{
                    width: getResponsiveWidth(12),
                    height: getResponsiveWidth(12),
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: recordingPlay ? COLORS.black : 'red',
                    }}
                    source={recordingPlay ? ICONS_URI.pause : ICONS_URI.play}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSendVoice}
                  style={{
                    width: getResponsiveWidth(12),
                    height: getResponsiveWidth(12),
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary
                  }}
                >
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: COLORS.white,
                    }}
                    source={ICONS_URI.send}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

      </ImageBackground>
    </>
  );
};

export default OpenChat;

