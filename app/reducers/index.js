// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import file from './file';
import user from './user';

const rootReducer = combineReducers({
  file,
  router,
  user
});

export default rootReducer;
