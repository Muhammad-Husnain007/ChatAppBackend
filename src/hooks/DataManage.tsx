import React, { createContext, useState } from 'react';

// 1. Context create karna
const AppContext = createContext();

// 2. Context ko provide karne ke liye ek provider component
export const AppProvider = ({ children }: any) => {
  const [sendVoiceDuration, setSendVoiceDuration] = useState(null);

  return (
    <AppContext.Provider value={{ sendVoiceDuration, setSendVoiceDuration }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
