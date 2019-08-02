import {
  ADD_LOCAL_DOWNLOADS,
  ADD_DOWNLOADED,
  REMOVE_DOWNLOADED
} from '../actions/download';

const initialState = {};

const downloads = (
  state = initialState,
  { type, storageFiles, fileID, savePath, user }
) => {
  switch (type) {
    case ADD_LOCAL_DOWNLOADS:
      return { ...storageFiles };

    case ADD_DOWNLOADED:
      return { ...state, [fileID]: { savePath, user } };

    case REMOVE_DOWNLOADED: {
      const { [fileID]: removeValue, ...nextState } = state;
      return nextState;
    }

    default:
      return state;
  }
};

export default downloads;
