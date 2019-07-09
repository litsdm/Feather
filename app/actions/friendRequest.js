// @flow
import callApi from '../helpers/apiCaller';

export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const REQUEST_FRIEND_REQUESTS = 'REQUEST_FRIEND_REQUESTS';
export const RECEIVE_FRIEND_REQUESTS = 'RECEIVE_FRIEND_REQUESTS';
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST';

export const addFriendRequest = friendRequest => ({
  friendRequest,
  type: ADD_FRIEND_REQUEST
});

export const removeFriendRequest = index => ({
  index,
  type: REMOVE_FRIEND_REQUEST
});

const requestFriendRequests = () => ({
  type: REQUEST_FRIEND_REQUESTS
});

const receiveFriendRequests = friendRequests => ({
  friendRequests,
  receivedAt: Date.now(),
  type: RECEIVE_FRIEND_REQUESTS
});

const getFriendRequests = async userID => {
  try {
    const response = await callApi(`friendRequest/${userID}`);
    const { friendRequests } = await response.json();
    return friendRequests;
  } catch (exception) {
    throw new Error(`[friendRequests.getFriendRequests] ${exception.message}`);
  }
};

const fetchFriendRequests = userID => async dispatch => {
  try {
    dispatch(requestFriendRequests());
    const friendRequests = await getFriendRequests(userID);
    return dispatch(receiveFriendRequests(friendRequests));
  } catch (exception) {
    console.error(exception.message);
  }
};

const shouldFetchFriendRequests = ({
  friendRequest: { friendRequests, isFetching }
}) => {
  if (!friendRequests || friendRequests.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchFriendRequestsIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchFriendRequests(state)) {
    return dispatch(fetchFriendRequests(state.user.id));
  }
};
