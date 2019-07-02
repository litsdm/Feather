import {
  ADD_FILE_TO_QUEUE,
  UPDATE_PROGRESS,
  AWAIT_RECIPIENTS,
  STOP_WAITING,
  COMPLETE_FILE,
  FINISH_UPLOADING
} from '../actions/queue';

const initialState = {
  isWaiting: false,
  files: {},
  waitFiles: [],
  completedCount: 0
};

const queue = (
  state = initialState,
  { type, waitFiles, file, id, progress, count }
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
        : initialState;

    default:
      return state;
  }
};

export default queue;
