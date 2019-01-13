import jwtDecode from 'jwt-decode';
import { emit } from '../socketClient';
import callApi from '../helpers/apiCaller';

export const ADD_USER = 'ADD_USER';
export const USER_LOGOUT = 'USER_LOGOUT';

export const addUser = user => ({
  type: ADD_USER,
  user
});

export const logoutUser = () => ({
  type: USER_LOGOUT
});

export const addUserFromToken = token => dispatch => {
  const user = jwtDecode(token);
  localStorage.setItem('tempoToken', token);
  dispatch(addUser(user));
};

export const updateUserProperty = (name, value) => (dispatch, getState) => {
  const {
    user: { id, remainingBytes }
  } = getState();
  const payload = { name, value: remainingBytes - value };

  return callApi(`${id}/update`, payload, 'PUT')
    .then(res => res.json())
    .then(({ token }) => {
      emit('updatedUser', { roomId: id, token });
      return dispatch(addUserFromToken(token));
    });
};
