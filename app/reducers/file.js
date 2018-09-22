import { ADD_FILE, FINISH_UPLOAD, UPDATE_UPLOAD_PROGRESS, REQUEST_FILES, RECEIVE_FILES, REMOVE_FILE } from '../actions/file';

const initialState = {
  isUploading: false,
  uploadId: '',
  progress: 0,
  isFetching: false,
  files: []
};

export default function counter(state = initialState, { type, file, upload, progress, files, index }) {
  switch (type) {
    case ADD_FILE:
      return {
        ...state,
        files: state.isUploading ? [state.files[0], file, ...state.files.slice(1)] : [file, ...state.files],
        isUploading: upload,
        uploadId: !state.isUploading && upload ? file._id : null
      };
    case FINISH_UPLOAD:
      return {
        ...state,
        isUploading: false,
        uploadId: ''
      };
    case UPDATE_UPLOAD_PROGRESS:
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
        isFetching: false
      }
    case REMOVE_FILE:
      return {
        ...state,
        files: [...state.files.slice(0, index), ...state.files.slice(index + 1)]
      }
    default:
      return state;
  }
}
