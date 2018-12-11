import fs from 'fs';
import mime from 'mime-types';
import callApi, { uploadFile } from '../helpers/apiCaller';
import notify from '../helpers/notifications';
import { emit } from '../socketClient';

import { addFile } from './file';

export const START_UPLOAD = 'START_UPLOAD';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';
export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';
export const ADD_FILE_TO_QUEUE = 'ADD_FILE_TO_QUEUE';
export const AWAIT_SEND_FOR_FILES = 'AWAIT_SEND_FOR_FILES';
export const STOP_WAITING = 'STOP_WAITING';
export const SET_ADD_FLAG = 'SET_ADD_FLAG';

export const awaitSendForFiles = waitFiles => ({
  waitFiles,
  type: AWAIT_SEND_FOR_FILES
});

export const uploadWithSend = (send, addToUser) => (dispatch, getState) => {
  const {
    upload: { waitFiles }
  } = getState();
  dispatch(stopWaiting(addToUser));
  dispatch(addFilesToQueue(waitFiles, send));
};

export const uploadDirectly = (files, send, addToUser = false) => dispatch => {
  dispatch(setAddFlag(addToUser));
  dispatch(addFilesToQueue(files, send));
};

const setAddFlag = addToUser => ({
  addToUser,
  type: SET_ADD_FLAG
});

export const stopWaiting = (addToUser = false) => ({
  addToUser,
  type: STOP_WAITING
});

const startUpload = file => ({
  file,
  type: START_UPLOAD
});

const addFileToQueue = file => ({
  file,
  type: ADD_FILE_TO_QUEUE
});

const handleFinish = () => (dispatch, getState) => {
  const {
    upload: { queue }
  } = getState();
  dispatch(finishUpload());
  if (queue.length > 0) dispatch(uploadFromQueue());
};

const updateProgress = progress => ({
  progress,
  type: UPDATE_UPLOAD_PROGRESS
});

const uploadFromQueue = () => (dispatch, getState) => {
  const {
    upload: { queue, addToUser }
  } = getState();
  const rawFile = queue[0];
  const file = {
    name: rawFile.name,
    size: rawFile.size,
    s3Url: '',
    from: rawFile.send.from,
    to: rawFile.send.to,
    type: rawFile.type.replace('+', '%2B')
  };
  let signedReq;

  callApi(
    `sign-s3?file-name=${file.name}&file-type=${file.type}&folder-name=Files`
  )
    .then(res => res.json())
    .then(({ signedRequest, url }) => {
      file.s3Url = url;
      signedReq = signedRequest;
      return callApi(`files`, file, 'POST');
    })
    .then(res => res.json())
    .then(({ file: dbFile }) => {
      dispatch(startUpload(dbFile));
      uploadFile(
        rawFile,
        signedReq,
        progress => dispatch(updateProgress(progress)),
        () => {
          const localConfig = JSON.parse(localStorage.getItem('localConfig'));

          file.to.forEach(receiver =>
            emit('sendFile', { roomId: receiver, file: dbFile })
          );

          if (addToUser) dispatch(addFile(dbFile));
          dispatch(handleFinish());

          if (localConfig.notifyUpload) {
            notify({
              title: 'File Uploaded',
              body: `${dbFile.name} has finished uploading.`
            });
          }
        }
      );
      return Promise.resolve();
    })
    .catch(() => {
      console.log('upload error');
    });
};

export function addFilesToQueue(files, send) {
  return (dispatch, getState) => {
    const {
      upload: { isUploading }
    } = getState();
    let uploadFlag = false;
    files.forEach(file => {
      const rawFile = typeof file === 'string' ? getFileFromPath(file) : file;
      const reader = new FileReader();
      reader.onload = () => {
        const loadedFile = rawFile;
        loadedFile.send = send;
        dispatch(addFileToQueue(loadedFile));
        if (!isUploading && !uploadFlag) {
          dispatch(uploadFromQueue());
          uploadFlag = true;
        }
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsDataURL(rawFile);
    });
  };
}

export const finishUpload = () => ({
  type: FINISH_UPLOAD
});

const getFileFromPath = path => {
  const data = fs.readFileSync(path);
  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1];

  const file = new File([data], filename, { type: mime.lookup(filename) });

  return file;
};
