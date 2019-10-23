import moment from 'moment';
import callApi from '../helpers/apiCaller';

export const ADD_SENT_FILE = 'ADD_SENT_FILE';
export const FINISH_PERSONAL_UPLOAD = 'FINISH_PERSONAL_UPLOAD';
export const REQUEST_SENT_FILES = 'REQUEST_SENT_FILES';
export const RECEIVE_SENT_FILES = 'RECEIVE_SENT_FILES';
export const REMOVE_SENT_FILE = 'REMOVE_SENT_FILE';
export const REMOVE_SENT_FILE_BY_ID = 'REMOVE_SENT_FILE_BY_ID';

export const addSentFile = file => ({
  file,
  type: ADD_SENT_FILE
});

export const removeSentFile = index => ({
  index,
  type: REMOVE_SENT_FILE
});

export const removeSentFileById = id => ({
  id,
  type: REMOVE_SENT_FILE_BY_ID
});

export const finishUpload = () => ({
  type: FINISH_PERSONAL_UPLOAD
});

const requestSentFiles = () => ({
  type: REQUEST_SENT_FILES
});

const receiveSentFiles = files => ({
  files,
  receivedAt: Date.now(),
  type: RECEIVE_SENT_FILES
});

const getSentFiles = async userID => {
  try {
    const response = await callApi(`files/${userID}/sent`);
    const { files } = await response.json();
    return files;
  } catch (exception) {
    throw new Error(`[file.getSentFiles] ${exception.message}`);
  }
};

const fetchSentFiles = userID => async dispatch => {
  try {
    dispatch(requestSentFiles());
    const files = await getSentFiles(userID);
    const addFiles = await dispatch(removeSentFilesIfExpired(userID, files));
    return dispatch(receiveSentFiles(addFiles));
  } catch (exception) {
    console.log(exception.message);
  }
};

const shouldFetchSentFiles = ({ file: { files, isFetching } }) => {
  if (!files || files.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchSentFilesIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchSentFiles(state)) {
    return dispatch(fetchSentFiles(state.user.id));
  }
};

const removeSentFilesIfExpired = (userId, files) => async dispatch => {
  try {
    const addFiles = [];
    const deletePromises = [];
    const s3Promises = [];

    files.forEach((file, index) => {
      const { expiresAt, s3Filename, _id } = file;
      if (moment().diff(expiresAt) > 0) {
        deletePromises.push(callApi(`${userId}/files/${_id}`, {}, 'DELETE'));
        s3Promises.push(callApi('delete-s3', { filename: s3Filename }, 'POST'));
        dispatch(removeSentFile(index));
      } else addFiles.push(file);
    });

    await deletePromises;
    await s3Promises;
    return addFiles;
  } catch (exception) {
    console.log(exception.message);
  }
};
