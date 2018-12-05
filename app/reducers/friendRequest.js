import {
  ADD_FRIEND_REQUEST,
  REQUEST_FRIEND_REQUESTS,
  RECEIVE_FRIEND_REQUESTS,
  REMOVE_FRIEND_REQUEST
} from '../actions/friendRequest';

const initialState = {
  isFetching: false,
  friendRequests: []
};

export default function counter(
  state = initialState,
  { type, friendRequest, friendRequests, index }
) {
  switch (type) {
    case ADD_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: [...friendRequests, friendRequest]
      };

    case REQUEST_FRIEND_REQUESTS:
      return {
        ...state,
        isFetching: true
      };

    case RECEIVE_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequests: [...friendRequests, ...state.friendRequests],
        isFetching: false
      };

    case REMOVE_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: [
          ...state.friendRequests.slice(0, index),
          ...state.friendRequests.slice(index + 1)
        ]
      };

    default:
      return state;
  }
}
