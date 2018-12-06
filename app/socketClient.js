import io from 'socket.io-client';
import { getApiUrl } from './helpers/apiCaller';

const apiUrl = getApiUrl();
const socket = io(apiUrl);

export const emit = (event, data = null) => {
  socket.emit(event, data);
};

export default socket;
