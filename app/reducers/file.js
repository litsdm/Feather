import { ADD_FILE, FINISH_UPLOAD } from '../actions/file';

const initialState = {
  isUploading: false,
  files: []
};

export default function counter(state = initialState, { type, file, upload }) {
  switch (type) {
    case ADD_FILE:
      return {
        ...state,
        files: state.isUploading ? [state.files[0], file, ...state.files.slice(1)] : [file, ...state.files],
        isUploading: upload
      };
    case FINISH_UPLOAD:
      return {
        ...state,
        isUploading: false,
        files: [
          {
            ...state.files[0],
            state: 'sent'
          },
          ...state.files.slice(1)
        ]
      };
    default:
      return state;
  }
}
