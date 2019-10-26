import jwtDecode from 'jwt-decode';
import { emit } from '../socketClient';
import callApi from '../helpers/apiCaller';

export const ADD_USER = 'ADD_USER';
export const USER_LOGOUT = 'USER_LOGOUT';
export const REQUEST_RECENT_EMAILS = 'REQUEST_RECENT_EMAILS';
export const RECEIVE_RECENT_EMAILS = 'RECEIVE_RECENT_EMAILS';

export const addUser = user => ({
  type: ADD_USER,
  user
});

export const logoutUser = () => ({
  type: USER_LOGOUT
});

const requestRecentEmails = () => ({
  type: REQUEST_RECENT_EMAILS
});

const receiveRecentEmails = recentEmails => ({
  type: RECEIVE_RECENT_EMAILS,
  recentEmails
});

export const addUserFromToken = (token, cb = null) => async dispatch => {
  const user = jwtDecode(token);
  localStorage.setItem('tempoToken', token);
  await dispatch(addUser(user));
  if (cb) cb();
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

const putRecentEmails = async (recentEmails, userID) => {
  try {
    await callApi(`${userID}/recentlySent`, { recentEmails }, 'PUT');
  } catch (exception) {
    throw new Error(exception);
  }
};

export const setRecentEmails = usedEmails => (dispatch, getState) => {
  const {
    user: { id, recentEmails }
  } = getState();
  const missing = 5 - usedEmails.length;
  let newEmails;
  if (usedEmails.length > 5) newEmails = [...usedEmails.slice(5)];
  else {
    newEmails =
      recentEmails.length < missing
        ? [...usedEmails, ...recentEmails]
        : [...usedEmails, ...recentEmails.slice(missing)];
  }

  try {
    dispatch(receiveRecentEmails(newEmails));
    dispatch(putRecentEmails(newEmails, id));
  } catch (exception) {
    console.log(`[user.setRecentEmails] ${exception.message}`);
  }
};

const getRecentEmails = async userID => {
  try {
    const response = await callApi(`${userID}/recentlySent`);
    const { recentEmails } = await response.json();
    return recentEmails;
  } catch (exception) {
    throw new Error(`[user.getRecentEmails] ${exception.message}`);
  }
};

const fetchRecentEmails = userID => async dispatch => {
  try {
    dispatch(requestRecentEmails());
    const recentEmails = await getRecentEmails(userID);
    return dispatch(receiveRecentEmails(recentEmails));
  } catch (exception) {
    console.log(exception.message);
  }
};

const shouldFetchRecent = ({ user: { recentEmails, isFetching } }) => {
  if (!recentEmails || recentEmails.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchRecentEmailsIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchRecent(state)) {
    return dispatch(fetchRecentEmails(state.user.id));
  }
};
