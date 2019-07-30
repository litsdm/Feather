import moment from 'moment';

import callApi from '../helpers/apiCaller';

export const ADD_LINK = 'ADD_LINK';
export const REQUEST_LINKS = 'REQUEST_LINKS';
export const RECEIVE_LINKS = 'RECEIVE_LINKS';
export const REMOVE_LINK = 'REMOVE_LINK';

const insertLink = (link, insertIndex) => ({
  link,
  insertIndex,
  type: ADD_LINK
});

export const removeLink = index => ({
  index,
  type: REMOVE_LINK
});

const requestLinks = () => ({
  type: REQUEST_LINKS
});

const receiveLinks = links => ({
  links,
  receivedAt: Date.now(),
  type: RECEIVE_LINKS
});

export const deleteLink = (id, index, s3Filename) => async dispatch => {
  try {
    await callApi(`links/${id}`, {}, 'DELETE');
    await callApi('delete-s3', { filename: s3Filename }, 'POST');
    dispatch(removeLink(index));
  } catch (exception) {
    console.error(`[link.deleteLink] ${exception.message}`);
  }
};

export const addLink = link => (dispatch, getState) => {
  const {
    link: { links }
  } = getState();
  const insertIndex = getInsertIndex(link, links);

  dispatch(insertLink(link, insertIndex));
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

const getInsertIndex = ({ s3Filename }, links) => {
  for (let i = 0; i < links.length; i += 1) {
    const { s3Filename: checkFilename } = links[i];
    if (s3Filename.toLowerCase() < checkFilename.toLowerCase()) {
      return i;
    }
  }

  return null;
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
