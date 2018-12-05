// @flow
import callApi from '../helpers/apiCaller';

export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const REQUEST_FRIEND_REQUESTS = 'REQUEST_FRIEND_REQUESTS';
export const RECEIVE_FRIEND_REQUESTS = 'RECEIVE_FRIEND_REQUESTS';
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST';

export function addFriendRequest(friendRequest) {
  return {
    friendRequest,
    type: ADD_FRIEND_REQUEST
  };
}

export function removeFriendRequest(index) {
  return {
    index,
    type: REMOVE_FRIEND_REQUEST
  };
}

function requestFriendRequests() {
  return {
    type: REQUEST_FRIEND_REQUESTS
  };
}

function receiveFriendRequests(friendRequests) {
  return {
    type: RECEIVE_FRIEND_REQUESTS,
    friendRequests,
    receivedAt: Date.now()
  };
}

function fetchFriendRequests(userId) {
  return dispatch => {
    dispatch(requestFriendRequests());
    return callApi(`friendRequest/${userId}`)
      .then(res => res.json())
      .then(({ friendRequests }) =>
        dispatch(receiveFriendRequests(friendRequests))
      );
  };
}

function shouldFetchFriendRequests({
  friendRequest: { friendRequests, isFetching }
}) {
  if (!friendRequests || friendRequests.length <= 0) return true;
  if (isFetching) return false;

  return false;
}

export function fetchFriendRequestsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchFriendRequests(state)) {
      return dispatch(fetchFriendRequests(state.user.id));
    }
  };
}
