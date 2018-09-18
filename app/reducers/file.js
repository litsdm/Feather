import { ADD_FILE, FINISH_UPLOAD, UPDATE_UPLOAD_PROGRESS, REQUEST_FILES, RECEIVE_FILES } from '../actions/file';

const initialState = {
  isUploading: false,
  uploadId: null,
  progress: 0,
  isFetching: false,
  files: []
};

export default function counter(state = initialState, { type, file, upload, progress, files }) {
  switch (type) {
    case ADD_FILE:
      return {
        ...state,
        files: state.isUploading ? [state.files[0], file, ...state.files.slice(1)] : [file, ...state.files],
        isUploading: upload,
        uploadId: !state.isUploading && upload ? file.id : null
      };
    case FINISH_UPLOAD:
      return {
        ...state,
        isUploading: false,
        uploadId: null
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
    default:
      return state;
  }
}
