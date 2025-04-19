
import { Server } from 'socket.io';
import { Message } from './models/message.model.js';

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join Chat Room
    socket.on("joinChat", async({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat room: ${chatId}`);
      const updatedMessages = await Message.updateMany(
        {
          chatId,
          receiver: userId,
          status: "sent"
        },
        {
          $set: { status: "delivered" }
        }
      );
    
      console.log("Messages updated to 'delivered2':", updatedMessages);
      console.log('userId yahan hai: ', userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Send message to specific chat room
    socket.on("sendMessage", (message) => {
      const { chatId } = message;
      socket.to(chatId).emit("receiveMessage", message);  
    });

    // Update message
    socket.on("updateMessage", (updatedMessage) => {
      const { chatId } = updatedMessage;
      socket.to(chatId).emit("messageUpdated", updatedMessage);
    });

    // Delete message
    socket.on("deleteMessage", (deletedMessage) => {
      const { chatId } = deletedMessage;
      socket.to(chatId).emit("messageDeleted", deletedMessage); 
    });

    // Other events
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




