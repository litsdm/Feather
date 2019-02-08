import {
  ADD_DOWNLOAD,
  FINISH_DOWNLOAD,
  UPDATE_DOWNLOAD_PROGRESS
} from '../actions/download';

const initialState = {};

const downloads = (state = initialState, { type, fileId, progress }) => {
  switch (type) {
    case ADD_DOWNLOAD:
      return { ...state, [fileId]: { progress: 0 } };

    case FINISH_DOWNLOAD: {
      const { [fileId]: removedValue, ...newState } = state;
      return newState;
    }

    case UPDATE_DOWNLOAD_PROGRESS:
      return {
        ...state,
        [fileId]: { progress }
      };

    default:
      return state;
  }
};

export default downloads;
