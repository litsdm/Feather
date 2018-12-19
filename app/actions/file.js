// @flow
import moment from 'moment';
import callApi from '../helpers/apiCaller';

export const ADD_FILE = 'ADD_FILE';
export const FINISH_PERSONAL_UPLOAD = 'FINISH_PERSONAL_UPLOAD';
export const UPDATE_PU_PROGRESS = 'UPDATE_PU_PROGRESS';
export const REQUEST_FILES = 'REQUEST_FILES';
export const RECEIVE_FILES = 'RECEIVE_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const REQUEST_FAILED = 'REQUEST_FAILED';

export function addFile(file, upload = false) {
  return {
    file,
    upload,
    type: ADD_FILE
  };
}

export function removeFile(index) {
  return {
    index,
    type: REMOVE_FILE
  };
}

export function updateProgress(progress) {
  return {
    progress,
    type: UPDATE_PU_PROGRESS
  };
}

export function finishUpload() {
  return {
    type: FINISH_PERSONAL_UPLOAD
  };
}

function requestFiles() {
  return {
    type: REQUEST_FILES
  };
}

function receiveFiles(files) {
  return {
    type: RECEIVE_FILES,
    files,
    receivedAt: Date.now()
  };
}

const requestFailed = () => ({
  type: REQUEST_FAILED
});

const fetchFiles = userId => dispatch => {
  dispatch(requestFiles());
  return callApi(`${userId}/files`)
    .then(res => res.json())
    .then(({ files }) => {
      dispatch(removeFilesIfExpired(userId, files));
      return dispatch(receiveFiles(files));
    })
    .catch(() => dispatch(requestFailed()));
};

function shouldFetchFiles({ file: { files, isFetching } }) {
  if (!files || files.length <= 0) return true;
  if (isFetching) return false;

  return false;
}

export function fetchFilesIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchFiles(state)) {
      return dispatch(fetchFiles(state.user.id));
    }
  };
}

function removeFilesIfExpired(userId, files) {
  return dispatch => {
    files.forEach(({ expiresAt, name, _id }, index) => {
      if (moment().diff(expiresAt) > 0) {
        callApi(`${userId}/files/${_id}`, {}, 'DELETE');
        callApi('delete-s3', { filename: name }, 'POST')
          .then(({ status }) => {
            if (status !== 200) return Promise.reject();

            return dispatch(removeFile(index));
          })
          .catch(() => console.log('error'));
      }
    });
  };
}
