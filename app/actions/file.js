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

export const addFile = file => ({
  file,
  type: ADD_FILE
});

export const removeFile = index => ({
  index,
  type: REMOVE_FILE
});

export const updateProgress = progress => ({
  progress,
  type: UPDATE_PU_PROGRESS
});

export const finishUpload = () => ({
  type: FINISH_PERSONAL_UPLOAD
});

const requestFiles = () => ({
  type: REQUEST_FILES
});

const receiveFiles = files => ({
  files,
  receivedAt: Date.now(),
  type: RECEIVE_FILES
});

const requestFailed = () => ({
  type: REQUEST_FAILED
});

const getFiles = async userID => {
  try {
    const response = await callApi(`${userID}/files`);
    const { files } = await response.json();
    return files;
  } catch (exception) {
    throw new Error(`[file.getFiles] ${exception.message}`);
  }
};

const fetchFiles = userID => async dispatch => {
  try {
    dispatch(requestFiles());
    const files = await getFiles(userID);
    const addFiles = await dispatch(removeFilesIfExpired(userID, files));
    return dispatch(receiveFiles(addFiles));
  } catch (exception) {
    dispatch(requestFailed());
    console.log(exception.message);
  }
};

const shouldFetchFiles = ({ file: { files, isFetching } }) => {
  if (!files || files.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchFilesIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchFiles(state)) {
    return dispatch(fetchFiles(state.user.id));
  }
};

const removeFilesIfExpired = (userId, files) => async dispatch => {
  try {
    const addFiles = [];
    const deletePromises = [];
    const s3Promises = [];

    files.forEach((file, index) => {
      const { expiresAt, s3Filename, _id } = file;
      if (moment().diff(expiresAt) > 0) {
        deletePromises.push(callApi(`${userId}/files/${_id}`, {}, 'DELETE'));
        s3Promises.push(callApi('delete-s3', { filename: s3Filename }, 'POST'));
        dispatch(removeFile(index));
      } else addFiles.push(file);
    });

    await deletePromises;
    await s3Promises;
    return addFiles;
  } catch (exception) {
    console.error(exception.message);
  }
};
