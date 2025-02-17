import AsyncStorage from "@react-native-async-storage/async-storage";

// API object
export const API = {
  BASE_URI: `http://192.168.0.105:3000`,
  userId: null, 
  authToken: null, 

  initialize: async () => {
    try {
      const token: any = await AsyncStorage.getItem('AuthToken');
      const userId: any = await AsyncStorage.getItem('UserId');

      API.userId = userId || null;  
      API.authToken = token || null; 

      console.log('API initialized with:', { authToken: API.authToken, userId: API.userId });
    } catch (error) {
      console.error('Error initializing API:', error);
    }
  }
};

API.initialize();
