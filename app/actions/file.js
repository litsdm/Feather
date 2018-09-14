// @flow
export const ADD_FILE = 'ADD_FILE';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';

export function addFile(file, upload) {
  return {
    file,
    upload,
    type: ADD_FILE
  };
}

export function finishUpload() {
  return {
    type: FINISH_UPLOAD
  };
}
