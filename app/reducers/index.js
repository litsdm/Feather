// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import file from './file';
import user from './user';
import downloads from './download';

import { USER_LOGOUT } from '../actions/user';

const appReducer = combineReducers({
  downloads,
  file,
  router,
  user
});

const rootReducer = (state, action) => {
  const appState = action.type === USER_LOGOUT ? undefined : state
  return appReducer(appState, action)
}

export default rootReducer;
