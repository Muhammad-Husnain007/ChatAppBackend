import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { ICONS_URI } from '../../../../constants/Icons';

const Voicee = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Store messages
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const handleSend = () => {
    // Handle sending the text message
    setMessages([...messages, message]); // Add new message to the list
    setMessage(''); // Clear the input after sending
  };

  const sendVoice = async () => {
    if (isRecording) {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording stopped. File saved at:', result);
      setIsRecording(false);
     
      // Add the recorded voice message to the messages list
      setMessages([...messages, { type: 'voice', uri: result }]); // Store the voice message
    } else {
      const path = `${RNFS.DocumentDirectoryPath}/hello_${Date.now()}.mp3`; // Unique file name with timestamp
      const uri = await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
      console.log('Recording started:', uri);
    }
  };

  const playVoiceMessage = async (uri) => {
    console.log('Playing voice message:', uri);
    await audioRecorderPlayer.startPlayer(uri);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.duration === e.currentPosition) {
        console.log('Finished playing');
        audioRecorderPlayer.stopPlayer();
      }
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80} // Adjust this value based on your layout
      >
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          {/* Display all messages */}
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <View key={index} style={styles.messageContainer}>
                {msg.type === 'text' ? (
                  <Text style={styles.messageText}>{msg}</Text>
                ) : (
                  <TouchableOpacity onPress={() => playVoiceMessage(msg.uri)}>
                    <Text style={styles.voiceMessageText}>🎤 Voice Message - Tap to Play</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noMessageText}>No messages yet</Text>
          )}
        </ScrollView>
       
        {/* Container for input and send button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={message ? handleSend : sendVoice} // Change here
          >
            {isRecording ? (
              <Image source={ICONS_URI.send} /> // You can replace with a stop recording icon
            ) : message ? (
              <Image source={ICONS_URI.send} />
            ) : (
              <Image source={ICONS_URI.send} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  scrollContent: {
    justifyContent: 'flex-end',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  voiceMessageText: {
    fontSize: 16,
    color: '#007BFF', // Change color for voice message
    textDecorationLine: 'underline',
  },
  noMessageText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
  },
});

export default Voicee;