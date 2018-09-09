// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import file from './file';

const rootReducer = combineReducers({
  file,
  router
});

export default rootReducer;
