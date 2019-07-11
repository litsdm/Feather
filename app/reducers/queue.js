import {
  ADD_FILE_TO_QUEUE,
  UPDATE_PROGRESS,
  AWAIT_RECIPIENTS,
  STOP_WAITING,
  COMPLETE_FILE,
  FINISH_UPLOADING,
  SET_LINK_URL,
  FINISH_ON_ERROR,
  FINISH_AND_CLEAN
} from '../actions/queue';

const initialState = {
  isWaiting: false,
  files: {},
  waitFiles: [],
  completedCount: 0,
  linkUrl: '',
  onlyLink: false
};

const queue = (
  state = initialState,
  { type, waitFiles, file, id, progress, count, url, error, onlyLink }
) => {
  switch (type) {
    case AWAIT_RECIPIENTS:
      return { ...state, waitFiles, isWaiting: true };

    case ADD_FILE_TO_QUEUE:
      return {
        ...state,
        files: {
          ...state.files,
          [file._id]: file
        }
      };

    case UPDATE_PROGRESS:
      return {
        ...state,
        files: {
          ...state.files,
          [id]: {
            ...state.files[id],
            progress
          }
        }
      };

    case STOP_WAITING:
      return { ...state, waitFiles: [], isWaiting: false };

    case COMPLETE_FILE:
      return { ...state, completedCount: count };

    case FINISH_UPLOADING:
      return state.isWaiting
        ? { ...state, files: {}, completedCount: 0 }
        : { ...initialState, linkUrl: state.linkUrl, onlyLink: state.onlyLink };

    case SET_LINK_URL:
      return { ...state, linkUrl: url, onlyLink };

    case FINISH_AND_CLEAN:
      return initialState;

    case FINISH_ON_ERROR:
      return { ...initialState, error };

    default:
      return state;
  }
};

export default queue;
