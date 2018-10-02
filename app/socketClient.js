import io from 'socket.io-client';

const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://tempo-share-web.herokuapp.com'
  : 'http://localhost:8080';
const socket = io(apiUrl);

export const emit = (event, data = null) => {
  socket.emit(event, data);
}

export default socket;
