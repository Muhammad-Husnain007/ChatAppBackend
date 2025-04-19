import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
// import { AppProvider } from './src/hooks/DataManage'; // Import the context provider
import StackNavigation from './src/navigation/StackNavigation'; // Import Stack Navigation
import Voice from './src/screens/tabs/openChat/components/voice';
import Voicee from './src/screens/tabs/openChat/components/voice';
import { ContactsProvider } from './src/hooks/UseContext';


const App = () => {
  return (
  //   <AppProvider> 
  <ContactsProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
  </ContactsProvider>
    // </AppProvider>
  );
}

export default App;


