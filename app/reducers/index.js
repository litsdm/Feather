// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import file from './file';
import user from './user';
import downloads from './download';
import upload from './upload';
import friend from './friend';
import friendRequest from './friendRequest';

import { USER_LOGOUT } from '../actions/user';

const appReducer = combineReducers({
  downloads,
  file,
  router,
  upload,
  friend,
  friendRequest,
  user
});

const rootReducer = (state, action) => {
  const appState = action.type === USER_LOGOUT ? undefined : state;
  return appReducer(appState, action);
};

export default rootReducer;
