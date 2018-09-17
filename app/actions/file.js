// @flow
export const ADD_FILE = 'ADD_FILE';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';
export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';

export function addFile(file, upload) {
  return {
    file,
    upload,
    type: ADD_FILE
  };
}

export function updateProgress(progress) {
  return {
    progress,
    type: UPDATE_UPLOAD_PROGRESS
  }
}

export function finishUpload() {
  return {
    type: FINISH_UPLOAD
  };
}
