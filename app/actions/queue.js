import fs from 'fs';
import mime from 'mime-types';

import { emit } from '../socketClient';
import { updateUserProperty } from './user';
import { addFile } from './file';
import callApi, { uploadFile } from '../helpers/apiCaller';
import notify from '../helpers/notifications';

export const AWAIT_RECIPIENTS = 'AWAIT_RECIPIENTS';
export const STOP_WAITING = 'STOP_WAITING';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const ADD_FILE_TO_QUEUE = 'ADD_FILE_TO_QUEUE';
export const COMPLETE_FILE = 'COMPLETE_FILE';
export const FINISH_UPLOADING = 'FINISH_UPLOADING';

export const awaitRecipients = waitFiles => ({
  waitFiles,
  type: AWAIT_RECIPIENTS
});

export const stopWaiting = () => ({
  type: STOP_WAITING
});

const addFileToQueue = file => ({
  file,
  type: ADD_FILE_TO_QUEUE
});

const updateProgress = (id, progress) => ({
  id,
  progress,
  type: UPDATE_PROGRESS
});

const completeFile = count => ({
  count,
  type: COMPLETE_FILE
});

const finishUploading = () => ({
  type: FINISH_UPLOADING
});

const notifyOnUpload = filename => {
  const { notifyUpload } = JSON.parse(localStorage.getItem('localConfig'));

  if (notifyUpload) {
    notify({
      title: 'File Uploaded',
      body: `${filename} has finished uploading.`
    });
  }
};

const uploadComplete = file => (dispatch, getState) => {
  const {
    user: { remainingBytes, remainingFiles },
    queue: { files, completedCount }
  } = getState();
  const dbFile = files[file.id];

  const newRemainingFiles =
    remainingFiles && remainingFiles <= 10 ? remainingFiles - 1 : 9;
  const newRemainingBytes = remainingBytes - file.size;

  file.to.forEach(receiver =>
    emit('sendFile', { roomId: receiver, file: dbFile })
  );

  if (dbFile.addToUser) dispatch(addFile(dbFile));

  if (completedCount + 1 === Object.keys(files).length)
    dispatch(finishUploading());
  else dispatch(completeFile(completedCount + 1));

  dispatch(updateUserProperty('remainingBytes', newRemainingBytes));
  dispatch(updateUserProperty('remainingFiles', newRemainingFiles));

  notifyOnUpload(dbFile.name);
};

const postFiles = async (files, signedReqs) => {
  // TODO: Add a try catch block to catch errors from promises
  const postPromises = [];
  const filePromises = [];
  files.forEach(({ name, size, type }, index) => {
    const postFile = { name, size, type, s3Url: signedReqs[index].url };
    postPromises.push(callApi('files', postFile, 'POST'));
  });
  const responses = await Promise.all(postPromises);

  responses.forEach(response => {
    filePromises.push(response.json());
  });

  return Promise.all(filePromises);
};

const signedRequests = async files => {
  const requestPromises = [];
  const responsePromises = [];
  files.forEach(file => {
    const type = file.type.replace('+', '%2B');
    requestPromises.push(
      callApi(
        `sign-s3?file-name=${file.name}&file-type=${type}&folder-name=Files`
      )
    );
  });

  const responses = await Promise.all(requestPromises);
  responses.forEach(response => {
    responsePromises.push(response.json());
  });

  return Promise.all(responsePromises);
};

const getFileFromPath = path => {
  const data = fs.readFileSync(path);
  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1];

  const file = new File([data], filename, { type: mime.lookup(filename) });

  return file;
};

const readFile = (file, send) =>
  new Promise((resolve, reject) => {
    const rawFile = typeof file === 'string' ? getFileFromPath(file) : file;
    const reader = new FileReader();
    reader.onload = () => {
      rawFile.send = send;
      resolve(rawFile);
    };
    reader.onabort = () => reject(new Error('file reading was aborted'));
    reader.onerror = () => reject(new Error('file reading has failed'));

    reader.readAsDataURL(rawFile);
  });

const readFiles = (files, send) => {
  // TODO: Add a try catch block to catch errors from promises
  const readPromises = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    readPromises.push(readFile(file, send));
  }

  return Promise.all(readPromises);
};

export const finishSelectingRecipients = (send, addToUser = false) => async (
  dispatch,
  getState
) => {
  const {
    queue: { waitFiles }
  } = getState();
  // TODO: Add the should send function
  const files = await readFiles(waitFiles, send);
  const signedReqs = await signedRequests(files);
  const dbFiles = await postFiles(files, signedReqs);

  const handleProgress = (id, progress) => {
    dispatch(updateProgress(id, progress));
  };

  const handleFinish = file => {
    dispatch(uploadComplete(file));
  };

  for (let i = 0; i < files.length; i += 1) {
    const { signedRequest } = signedReqs[i];
    const dbFile = dbFiles[i].file;
    const file = { ...files[i], id: dbFile._id, to: dbFile.to };

    dispatch(addFileToQueue({ ...dbFile, addToUser }));
    uploadFile(file, signedRequest, handleProgress, handleFinish);
  }

  dispatch(stopWaiting());
};
