import { SET_IS_LOADING } from '../actions/loading';

const initialState = false;

const loading = (state = initialState, { type, isLoading }) => {
  switch (type) {
    case SET_IS_LOADING:
      return isLoading;

    default:
      return state;
  }
};

export default loading;
