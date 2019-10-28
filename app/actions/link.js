import moment from 'moment';

import callApi from '../helpers/apiCaller';
import { emit } from '../socketClient';

export const ADD_LINK = 'ADD_LINK';
export const REQUEST_LINKS = 'REQUEST_LINKS';
export const RECEIVE_LINKS = 'RECEIVE_LINKS';
export const REMOVE_LINK = 'REMOVE_LINK';
export const REMOVE_LINK_BY_ID = 'REMOVE_LINK_BY_ID';

export const addLink = link => ({
  link,
  insertIndex: null,
  type: ADD_LINK
});

export const removeLink = index => ({
  index,
  type: REMOVE_LINK
});

export const removeLinkById = id => ({
  id,
  type: REMOVE_LINK_BY_ID
});

const requestLinks = () => ({
  type: REQUEST_LINKS
});

const receiveLinks = links => ({
  links,
  receivedAt: Date.now(),
  type: RECEIVE_LINKS
});

const deleteFiles = async files => {
  try {
    const s3Promises = [];
    const fileIDs = [];

    files.forEach(({ _id, s3Filename }) => {
      s3Promises.push(callApi('delete-s3', { filename: s3Filename }, 'POST'));
      fileIDs.push(_id);
    });

    await Promise.all(s3Promises);
    await callApi('files', { files: fileIDs }, 'DELETE');
  } catch (exception) {
    throw exception;
  }
};

export const deleteLink = link => async (dispatch, getState) => {
  try {
    const {
      user: { id: roomId }
    } = getState();
    const { _id, index, s3Filename, files } = link;
    await callApi(`links/${_id}`, {}, 'DELETE');

    if (s3Filename)
      await callApi('delete-s3', { filename: s3Filename }, 'POST');
    else await deleteFiles(files);

    emit('removeLinkByIdFromRoom', { roomId, id: _id });
    dispatch(removeLink(index));
  } catch (exception) {
    console.error(`[link.deleteLink] ${exception.message}`);
  }
};

const getLinks = async userID => {
  try {
    const response = await callApi(`${userID}/links`);
    const { links } = await response.json();
    return links;
  } catch (exception) {
    throw new Error(`[link.getLinks] ${exception.message}`);
  }
};

const fetchLinks = userID => async dispatch => {
  try {
    dispatch(requestLinks());
    const links = await getLinks(userID);
    dispatch(removeLinksIfExpired(links));
    return dispatch(receiveLinks(links));
  } catch (exception) {
    console.error(exception.message);
  }
};

const shouldFetchLinks = ({ link: { links, isFetching } }) => {
  if (!links || links.length <= 0) return true;
  if (isFetching) return false;

  return false;
};

export const fetchLinksIfNeeded = () => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchLinks(state)) {
    return dispatch(fetchLinks(state.user.id));
  }
};

const removeLinksIfExpired = links => async dispatch => {
  try {
    const deletePromises = [];
    const s3Promises = [];

    links.forEach(({ expiresAt, s3Filename, _id }, index) => {
      if (moment().diff(expiresAt) > 0) {
        deletePromises.push(callApi(`links/${_id}`, {}, 'DELETE'));
        s3Promises.push(callApi('delete-s3', { filename: s3Filename }, 'POST'));
        dispatch(removeLink(index));
      }
    });

    await deletePromises;
    await s3Promises;
  } catch (exception) {
    console.error(exception.message);
  }
};
