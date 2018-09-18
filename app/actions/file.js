// @flow
import callApi from '../helpers/apiCaller';

export const ADD_FILE = 'ADD_FILE';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';
export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';
export const REQUEST_FILES = 'REQUEST_FILES';
export const RECEIVE_FILES = 'RECEIVE_FILES';

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

function requestFiles() {
  return {
    type: REQUEST_FILES
  }
}

function receiveFiles(files) {
  return {
    type: RECEIVE_FILES,
    files,
    receivedAt: Date.now()
  }
}

function fetchFiles(userId) {
  return dispatch => {
    dispatch(requestFiles());
    return callApi(`${userId}/files`)
      .then(res => res.json())
      .then(({ files }) => dispatch(receiveFiles(files)))
  }
}

function shouldFetchFiles({ file: { files, isFetching } }) {
  if (!files || files.length <= 0) return true;
  if (isFetching) return false;

  return false;
}

export function fetchFilesIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);
    if (shouldFetchFiles(state)) {
      return dispatch(fetchFiles(state.user.id));
    }
  }
}
