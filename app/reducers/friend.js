import {
  ADD_FRIEND,
  REQUEST_FRIENDS,
  RECEIVE_FRIENDS,
  REMOVE_FRIEND
} from '../actions/friend';

const initialState = {
  isFetching: false,
  friends: []
};

export default function counter(
  state = initialState,
  { type, friend, friends, index }
) {
  switch (type) {
    case ADD_FRIEND:
      return {
        ...state,
        friends: [...state.friends, friend]
      };

    case REQUEST_FRIENDS:
      return {
        ...state,
        isFetching: true
      };

    case RECEIVE_FRIENDS:
      return {
        ...state,
        friends: [...friends, ...state.friends],
        isFetching: false
      };

    case REMOVE_FRIEND:
      return {
        ...state,
        friends: [
          ...state.friends.slice(0, index),
          ...state.friends.slice(index + 1)
        ]
      };

    default:
      return state;
  }
}
