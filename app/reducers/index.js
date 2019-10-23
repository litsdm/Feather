// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import file from './file';
import user from './user';
import friend from './friend';
import friendRequest from './friendRequest';
import upgrade from './upgrade';
import queue from './queue';
import loading from './loading';
import link from './link';
import download from './download';
import sentFile from './sentFile';

import { USER_LOGOUT } from '../actions/user';

const appReducer = history =>
  combineReducers({
    download,
    file,
    router: connectRouter(history),
    friend,
    friendRequest,
    user,
    upgrade,
    loading,
    link,
    sentFile,
    queue
  });

const rootReducer = history => (state, action) => {
  const appState = action.type === USER_LOGOUT ? undefined : state;
  return appReducer(history)(appState, action);
};

export default rootReducer;
