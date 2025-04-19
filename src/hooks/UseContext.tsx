// src/context/ContactsContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Contact {
    _id: string;
    contact: {
        user: any;
        firstName: string;
        lastName: string;
    };
}

interface ContactsContextProps {
    usersAdded: Contact[];
    setUsersAdded: React.Dispatch<React.SetStateAction<Contact[]>>;
    allMessages: any;
    setAllMessages: React.Dispatch<React.SetStateAction<any>>;
    contactsProfile: any;
    setContactsProfile: React.Dispatch<React.SetStateAction<any>>;
}


const ContactsContext = createContext<ContactsContextProps | undefined>(undefined);

export const ContactsProvider: React.FC = ({ children }:any) => {
    const [usersAdded, setUsersAdded] = useState<Contact[]>([]);
    const [allMessages, setAllMessages] = useState<any>([]);
    const [contactsProfile, setContactsProfile] = useState<any>([]);

    return (
        <ContactsContext.Provider value={{ usersAdded, setUsersAdded, allMessages, setAllMessages, contactsProfile, setContactsProfile  }}>
            {children}
        </ContactsContext.Provider>
    );
};

export const useContacts = (): ContactsContextProps => {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
};
