// socket.js - Handling socket.io logic

import { Server } from 'socket.io';

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });

    socket.on("sendMessage", (message) => {
      io.emit('messageReceived', message);
    });

    socket.on("updateMessage", (updatedMessage) => {
      io.emit('messageUpdated', updatedMessage);
    });

    socket.on("deleteMessage", (deletedMessage) => {
      io.emit('messageDeleted', deletedMessage); 
    });    

    socket.on("uploadProfile", (userId) => {
      io.emit('profileReceived', userId); 
    });

    socket.on("addContact", (userId) => {
      io.emit('getContacts', userId); 
    });
    socket.on("addUser", (getUser) => {
      io.emit('getUser', getUser); 
    });
    
  });
};

export default socketSetup;
