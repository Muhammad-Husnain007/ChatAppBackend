// // socketService.js
// import { io } from 'socket.io-client';
// import { API } from './Api';

// let socket;
// const userId = API.userId
// const userId = API.
// export const initializeSocket = (userId, chatId) => {
//   socket = io(`${API.BASE_URI}`);

//   socket.on('connect', () => {
//     console.log('Connected to socket server:', socket.id);
//     socket.emit('userConnected', { userId, chatId });
//   });
  
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     console.log('Disconnected from socket server');
//   }
// };

// export const onMessageReceived = (callback) => {
//   if (!socket) return;
//   socket.on('messageReceived', callback);
// };

// export const onMessageUpdated = (callback) => {
//   if (!socket) return;
//   socket.on('messageUpdated', callback);
// };

// export const onMessageDeleted = (callback) => {
//   if (!socket) return;
//   socket.on('messageDeleted', callback);
// };

// export const sendMessageSocket = (message) => {
//   if (!socket) return;
//   socket.emit('sendMessage', message);
// };

// export const deleteMessageSocket = (messageId) => {
//   if (!socket) return;
//   socket.emit('messageDeleted', messageId);
// };

// export const updateMessageSocket = (updatedMessage) => {
//   if (!socket) return;
//   socket.emit('messageUpdated', updatedMessage);
// };
