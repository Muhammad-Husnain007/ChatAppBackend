import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AppProvider } from './src/hooks/DataManage'; // Import the context provider
import StackNavigation from './src/navigation/StackNavigation'; // Import Stack Navigation
import Voice from './src/screens/tabs/openChat/components/voice';
import Voicee from './src/screens/tabs/openChat/components/voice';


const App = () => {
  return (
    <AppProvider> 
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AppProvider>
    // <Voicee />
  );
}

export default App;


