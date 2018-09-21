// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import file from './file';
import user from './user';
import downloads from './download';

const rootReducer = combineReducers({
  downloads,
  file,
  router,
  user
});

export default rootReducer;
