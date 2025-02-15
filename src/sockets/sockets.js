// backend/src/sockets.js

module.exports = (io, socket) => {
    console.log(`Socket connected: ${socket.id}`);
  
    // Example: Handle user joining a lobby
    socket.on('joinLobby', (lobbyId) => {
      socket.join(lobbyId);
      console.log(`Socket ${socket.id} joined lobby ${lobbyId}`);
      // Broadcast to others in the lobby
      socket.to(lobbyId).emit('userJoined', { socketId: socket.id });
    });
  
    // Example: Handle user leaving a lobby
    socket.on('leaveLobby', (lobbyId) => {
      socket.leave(lobbyId);
      console.log(`Socket ${socket.id} left lobby ${lobbyId}`);
      // Broadcast to others in the lobby
      socket.to(lobbyId).emit('userLeft', { socketId: socket.id });
    });
  
    // Example: Handle sending a chat message
    socket.on('sendMessage', ({ lobbyId, message }) => {
      console.log(`Message from ${socket.id} in lobby ${lobbyId}: ${message}`);
      // Broadcast the message to others in the lobby
      socket.to(lobbyId).emit('receiveMessage', { socketId: socket.id, message });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Optionally, handle cleanup or notify others
    });
  
    // Add more event handlers as needed for your application
  };
  