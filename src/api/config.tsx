import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';  // Firebase authentication module
import '@react-native-firebase/firestore';  // Firebase Firestore module

const FirebaseConfig = {
  apiKey: "AIzaSyBk5bmIdJwnmq-E-0MFykOmdQt3k6C_7OM",
  authDomain: "sendotp-975d9.firebaseapp.com",
  storageBucket: "sendotp-975d9.appspot.com",
  projectId: "sendotp-975d9",
  messagingSenderId: "371692829817",
  appId: "1:371692829817:android:1c077af90db0661a8968a8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConfig);
  console.log('App initialized successfully');
} else {
  firebase.app();
  console.log('App already initialized');
}

export { firebase };
