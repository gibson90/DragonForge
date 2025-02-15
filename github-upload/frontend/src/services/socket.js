// frontend/src/services/socket.js
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/modules/auth';
// import { useGameStore } from '@/store/modules/game';
// import { useLobbyStore } from '@/store/modules/lobby';
import router from '@/router/router';

class SocketService {
  constructor() {
    this.socket = null;
  }

  initialize() {
    const authStore = useAuthStore();
    //const gameStore = useGameStore();
    //const lobbyStore = useLobbyStore();
    const token = authStore.token || localStorage.getItem('token');

    if (!token) {
      console.warn('No token found. Socket.io not initialized.');
      return;
    }

    this.socket = io('http://localhost:4000', {
      query: {
        token,
      },
      transports: ['websocket'], // Optional: Force WebSocket
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket.io connection error:', err.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    // Handle custom events
    /*
    this.socket.on('updateLobbies', (lobbies) => {
      lobbyStore.updateAvailableLobbies(lobbies);
    });

    this.socket.on('updateLobby', (lobby) => {
      lobbyStore.updateCurrentLobby(lobby);
    });

    this.socket.on('gameStarted', (gameState) => {
      gameStore.setGameState(gameState);
      router.push({ name: 'GameBoard' });
    });

    this.socket.on('gameStateUpdate', (gameState) => {
      gameStore.setGameState(gameState);
    });
    */

    // Handle authentication errors
    this.socket.on('auth_error', (msg) => {
      console.error('Authentication error:', msg);
      authStore.logout();
      router.push({ name: 'Login' });
    });
  }

  emit(event, data, callback) {
    if (this.socket) {
      this.socket.emit(event, data, callback);
    } else {
      console.warn(`Socket not initialized. Unable to emit event: ${event}`);
    }
  }
}

export default new SocketService();
