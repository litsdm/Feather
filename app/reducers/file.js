import { ADD_FILE, FINISH_UPLOAD } from '../actions/file';

const initialState = {
  isUploading: false,
  uploadId: null,
  files: []
};

export default function counter(state = initialState, { type, file, upload }) {
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
    default:
      return state;
  }
}
