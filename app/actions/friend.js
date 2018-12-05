// @flow
import callApi from '../helpers/apiCaller';

export const ADD_FRIEND = 'ADD_FRIEND';
export const REQUEST_FRIENDS = 'REQUEST_FRIENDS';
export const RECEIVE_FRIENDS = 'RECEIVE_FRIENDS';
export const REMOVE_FRIEND = 'REMOVE_FRIEND';

export function addFriend(friend) {
  return {
    friend,
    type: ADD_FRIEND
  };
}

export function removeFriend(index) {
  return {
    index,
    type: REMOVE_FRIEND
  };
}

function requestFriends() {
  return {
    type: REQUEST_FRIENDS
  };
}

function receiveFriends(friends) {
  return {
    type: RECEIVE_FRIENDS,
    friends,
    receivedAt: Date.now()
  };
}

function fetchFriends(userId) {
  return dispatch => {
    dispatch(requestFriends());
    return callApi(`${userId}/friends`)
      .then(res => res.json())
      .then(({ friends }) => dispatch(receiveFriends(friends)));
  };
}

function shouldFetchFriends({ friend: { friends, isFetching } }) {
  if (!friends || friends.length <= 0) return true;
  if (isFetching) return false;

  return false;
}

export function fetchFriendsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchFriends(state)) {
      return dispatch(fetchFriends(state.user.id));
    }
  };
}
