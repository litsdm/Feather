import {
  ADD_USER,
  REQUEST_RECENT_EMAILS,
  RECEIVE_RECENT_EMAILS
} from '../actions/user';

const initialState = {
  isFetching: false,
  recentEmails: []
};

const users = (state = initialState, { type, user, recentEmails }) => {
  switch (type) {
    case ADD_USER:
      return { ...state, ...user };
    case REQUEST_RECENT_EMAILS:
      return { ...state, isFetching: true };
    case RECEIVE_RECENT_EMAILS:
      return { ...state, recentEmails, isFetching: false };
    default:
      return state;
  }
};

export default users;
