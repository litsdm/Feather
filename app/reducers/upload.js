import {
  ADD_FILE_TO_QUEUE,
  START_UPLOAD,
  FINISH_UPLOAD,
  UPDATE_UPLOAD_PROGRESS,
  AWAIT_SEND_FOR_FILES,
  STOP_WAITING,
  SET_ADD_FLAG,
  FINISH_AND_CLEAN,
  START_SENDING,
  UPDATE_STATUS,
  FINISH_SENDING,
  SET_LINK_URL
} from '../actions/upload';

const initialState = {
  isUploading: false,
  progress: 0,
  file: null,
  queue: [],
  waitFiles: [],
  isWaiting: false,
  addToUser: false,
  status: '',
  statusProgress: 0,
  isSending: false,
  linkUrl: ''
};

const downloads = (
  state = initialState,
  { type, file, progress, waitFiles, addToUser, status, statusProgress, url }
) => {
  switch (type) {
    /* case ADD_FILE_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, file]
      }; */

    case START_UPLOAD:
      return {
        ...state,
        isUploading: true,
        file,
        queue: state.queue.slice(1)
      };

    case UPDATE_UPLOAD_PROGRESS:
      return {
        ...state,
        progress
      };

    case FINISH_UPLOAD:
      return {
        ...state,
        isUploading: false,
        progress: 0,
        file: null
      };

    case START_SENDING:
      return {
        ...state,
        isSending: true
      };

    case UPDATE_STATUS:
      return {
        ...state,
        status,
        statusProgress
      };

    case FINISH_SENDING:
      return {
        ...state,
        isSending: false,
        status: '',
        statusProgress: 0
      };

    /* case AWAIT_SEND_FOR_FILES:
      return {
        ...state,
        isWaiting: true,
        waitFiles
      };

    case STOP_WAITING:
      return {
        ...state,
        isWaiting: false,
        waitFiles: [],
        addToUser
      }; */

    case SET_LINK_URL:
      return {
        ...state,
        linkUrl: url
      };

    case SET_ADD_FLAG:
      return {
        ...state,
        addToUser
      };

    case FINISH_AND_CLEAN:
      return initialState;

    default:
      return state;
  }
};

export default downloads;
