import { ipcRenderer } from 'electron';

export const ADD_DOWNLOAD = 'ADD_DOWNLOAD';
export const FINISH_DOWNLOAD = 'FINISH_DOWNLOAD';
export const UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS';

function addDownload(fileId) {
  return {
    fileId,
    type: ADD_DOWNLOAD
  };
}

export function downloadFile(fileId, url, filename) {
  const localPath =
    JSON.parse(localStorage.getItem('localConfig')).downloadPath || null;
  return dispatch => {
    ipcRenderer.send('download-file', { fileId, url, filename, localPath });
    dispatch(addDownload(fileId));
  };
}

export function updateDownloadProgress(fileId, progress) {
  return {
    fileId,
    progress,
    type: UPDATE_DOWNLOAD_PROGRESS
  };
}

export function finishDownload(fileId) {
  return {
    fileId,
    type: FINISH_DOWNLOAD
  };
}
