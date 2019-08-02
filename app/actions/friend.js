// @flow
import callApi from '../helpers/apiCaller';

export const ADD_FRIEND = 'ADD_FRIEND';
export const REQUEST_FRIENDS = 'REQUEST_FRIENDS';
export const RECEIVE_FRIENDS = 'RECEIVE_FRIENDS';
export const REMOVE_FRIEND = 'REMOVE_FRIEND';

const insertFriend = (friend, insertIndex) => ({
  friend,
  insertIndex,
  type: ADD_FRIEND
});

export const removeFriend = index => ({
  index,
  type: REMOVE_FRIEND
});

const requestFriends = () => ({
  type: REQUEST_FRIENDS
});

const receiveFriends = friends => ({
  friends,
  receivedAt: Date.now(),
  type: RECEIVE_FRIENDS
});

export const addFriend = friend => (dispatch, getState) => {
  const {
    friend: { friends }
  } = getState();
  const insertIndex = getInsertIndex(friend, friends);

  dispatch(insertFriend(friend, insertIndex));
};

const getFriends = async userID => {
  try {
    const response = await callApi(`${userID}/friends`);
    const { friends } = await response.json();
    return friends;
  } catch (exception) {
    throw new Error(`[friend.getFriends] ${exception.message}`);
  }
};

const fetchFriends = userID => async dispatch => {
  try {
    dispatch(requestFriends());
    const friends = await getFriends(userID);
    return dispatch(receiveFriends(friends));
  } catch (exception) {
    console.error(exception.message);
  }
};

const shouldFetchFriends = ({ friend: { friends, isFetching } }) => {
  if (!friends || friends.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchFriendsIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchFriends(state)) {
    return dispatch(fetchFriends(state.user.id));
  }
};

const getInsertIndex = ({ username }, friends) => {
  for (let i = 0; i < friends.length; i += 1) {
    const { username: checkUsername } = friends[i];
    if (username.toLowerCase() < checkUsername.toLowerCase()) {
      return i;
    }
  }

  return null;
};
