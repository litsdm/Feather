import jwtDecode from 'jwt-decode';
import { ADD_USER, REMOVE_USER } from '../actions/user';

const token = localStorage.getItem('tempoToken');
const initialState = token ? jwtDecode(token) : {};

const users = (state = initialState, { type, user }) => {
  switch (type) {
    case ADD_USER:
      return { ...user };
    case REMOVE_USER:
      return {};
    default:
      return state;
  }
};

export default users;
