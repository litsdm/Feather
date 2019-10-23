import {
  ADD_SENT_FILE,
  FINISH_PERSONAL_UPLOAD,
  REQUEST_SENT_FILES,
  RECEIVE_SENT_FILES,
  REMOVE_SENT_FILE,
  REMOVE_SENT_FILE_BY_ID
} from '../actions/sentFile';

const initialState = {
  isFetching: false,
  files: []
};

export default function counter(
  state = initialState,
  { type, file, files, index, id }
) {
  switch (type) {
    case ADD_SENT_FILE:
      return {
        ...state,
        files: state.isUploading
          ? [state.files[0], file, ...state.files.slice(1)]
          : [file, ...state.files]
      };
    case FINISH_PERSONAL_UPLOAD:
      return {
        ...state,
        isUploading: false,
        uploadId: ''
      };
    case REQUEST_SENT_FILES:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_SENT_FILES:
      return {
        ...state,
        files: [...files, ...state.files],
        isFetching: false
      };
    case REMOVE_SENT_FILE:
      return {
        ...state,
        files: [...state.files.slice(0, index), ...state.files.slice(index + 1)]
      };
    case REMOVE_SENT_FILE_BY_ID:
      return {
        ...state,
        files: state.files.filter(({ _id }) => _id !== id)
      };
    default:
      return state;
  }
}
