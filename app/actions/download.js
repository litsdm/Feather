/* eslint-disable no-restricted-syntax */
import fs from 'fs';

export const ADD_LOCAL_DOWNLOADS = 'ADD_LOCAL_DOWNLOADS';
export const ADD_DOWNLOADED = 'ADD_DOWNLOADED';
export const REMOVE_DOWNLOADED = 'REMOVE_DOWNLOADED';

const addStorageFiles = storageFiles => ({
  type: ADD_LOCAL_DOWNLOADS,
  storageFiles
});

export const removeDownloaded = fileID => ({
  type: REMOVE_DOWNLOADED,
  fileID
});

const add = (fileID, savePath, user) => ({
  type: ADD_DOWNLOADED,
  fileID,
  savePath,
  user
});

export const addDownloaded = (fileID, savePath) => (dispatch, getState) => {
  const {
    user: { id },
    download: dlFiles
  } = getState();

  localStorage.setItem(
    'dlFiles',
    JSON.stringify({
      ...dlFiles,
      [fileID]: { savePath, user: id }
    })
  );

  return dispatch(add(fileID, savePath, id));
};

const filterExpiredDownloads = (fileIDs, storageFiles, userID) => {
  const newStorageFiles = { ...storageFiles };
  for (const [id, stored] of Object.entries(storageFiles)) {
    const { savePath, user } = stored;
    if (!fs.existsSync(savePath) || (!fileIDs[id] && user === userID)) {
      delete newStorageFiles[id];
    }
  }

  return newStorageFiles;
};

const getFileIDs = files => {
  const ids = {};
  files.forEach(({ _id }) => {
    ids[_id] = true;
  });
  return ids;
};

export const addLocalDownloads = () => (dispatch, getState) => {
  const {
    file: { files },
    user: { id }
  } = getState();
  let storageFiles = JSON.parse(localStorage.getItem('dlFiles'));
  if (!storageFiles) return;

  const fileIDs = getFileIDs(files);
  storageFiles = filterExpiredDownloads(fileIDs, storageFiles, id);
  return dispatch(addStorageFiles(storageFiles));
};
