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

const putUser = async (id, properties) => {
  try {
    const response = await callApi(`${id}/update`, { ...properties }, 'PUT');
    const { token } = await response.json();
    return token;
  } catch (exception) {
    throw new Error(`[user.putUser] ${exception.error}`);
  }
};

export const updateUser = properties => async (dispatch, getState) => {
  try {
    const {
      user: { id }
    } = getState();

    const token = await putUser(id, properties);
    emit('updatedUser', { roomId: id, token });
    return dispatch(addUserFromToken(token));
  } catch (exception) {
    console.error(exception.message);
  }
};
