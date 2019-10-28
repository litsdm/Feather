import {
  ADD_FILE,
  FINISH_PERSONAL_UPLOAD,
  UPDATE_PU_PROGRESS,
  REQUEST_FILES,
  RECEIVE_FILES,
  REMOVE_FILE,
  REQUEST_FAILED,
  REMOVE_FILE_BY_ID
} from '../actions/file';

const initialState = {
  isUploading: false,
  uploadId: '',
  progress: 0,
  isFetching: false,
  files: [],
  failed: false
};

export default function counter(
  state = initialState,
  { type, file, upload, progress, files, index, id }
) {
  switch (type) {
    case ADD_FILE:
      return {
        ...state,
        files: state.isUploading
          ? [state.files[0], file, ...state.files.slice(1)]
          : [file, ...state.files],
        isUploading: upload,
        uploadId: !state.isUploading && upload ? file._id : null
      };
    case FINISH_PERSONAL_UPLOAD:
      return {
        ...state,
        isUploading: false,
        uploadId: ''
      };
    case UPDATE_PU_PROGRESS:
      return {
        ...state,
        progress
      };
    case REQUEST_FILES:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_FILES:
      return {
        ...state,
        files: [...files, ...state.files],
        isFetching: false,
        failed: false
      };
    case REMOVE_FILE:
      return {
        ...state,
        files: [...state.files.slice(0, index), ...state.files.slice(index + 1)]
      };
    case REMOVE_FILE_BY_ID:
      return {
        ...state,
        files: state.files.filter(({ _id }) => _id !== id)
      };
    case REQUEST_FAILED:
      return {
        ...state,
        isFetching: false,
        failed: true
      };
    default:
      return state;
  }
}
