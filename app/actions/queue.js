import { remote } from 'electron';
import archiver from 'archiver';
import fs from 'fs';
import mime from 'mime-types';
import rimraf from 'rimraf';

import { emit } from '../socketClient';
import { updateUserProperty } from './user';
import { addFile } from './file';
import { displayUpgrade } from './upgrade';
import { setIsLoading } from './loading';
import callApi, { uploadFile } from '../helpers/apiCaller';
import notify from '../helpers/notifications';

export const AWAIT_RECIPIENTS = 'AWAIT_RECIPIENTS';
export const STOP_WAITING = 'STOP_WAITING';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const ADD_FILE_TO_QUEUE = 'ADD_FILE_TO_QUEUE';
export const COMPLETE_FILE = 'COMPLETE_FILE';
export const FINISH_UPLOADING = 'FINISH_UPLOADING';
export const SET_LINK_URL = 'SET_LINK_URL';
export const FINISH_ON_ERROR = 'FINISH_ON_ERROR';
export const FINISH_AND_CLEAN = 'FINISH_AND_CLEAN';

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

const setLinkUrl = url => ({
  url,
  type: SET_LINK_URL
});

const finishOnError = error => ({
  error,
  type: FINISH_ON_ERROR
});

const finishAndClean = () => ({
  type: FINISH_AND_CLEAN
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

const uploadComplete = (file, isLink = false) => (dispatch, getState) => {
  const {
    user: { remainingBytes, remainingFiles, username },
    queue: { files, completedCount }
  } = getState();
  const dbFile = files[file.id];

  const newRemainingFiles =
    remainingFiles && remainingFiles <= 10 ? remainingFiles - 1 : 9;
  const newRemainingBytes = remainingBytes - dbFile.size;

  if (isLink) {
    dispatch(setLinkUrl(`http://www.feathershare.com/${file.id}`));
    deleteDirectories();
    callApi(
      'email',
      { to: file.to, endpoint: file.id, from: username },
      'POST'
    );
  } else {
    file.to.forEach(receiver =>
      emit('sendFile', { roomId: receiver, file: dbFile })
    );
  }

  if (dbFile.addToUser) dispatch(addFile(dbFile));

  if (completedCount + 1 === Object.keys(files).length)
    dispatch(finishUploading());
  else dispatch(completeFile(completedCount + 1));

  dispatch(updateUserProperty('remainingBytes', newRemainingBytes));
  dispatch(updateUserProperty('remainingFiles', newRemainingFiles));

  notifyOnUpload(dbFile.name);
};

const postFiles = async (files, signedReqs) => {
  try {
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
  } catch (exception) {
    throw new Error(`[queue.postFiles] ${exception.message}`);
  }
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

const shouldSendMultiple = (files, dispatch, getState) => {
  let totalSize = 0;
  let count = 0;
  for (count; count < files.length; count += 1) {
    const { size } = files[count];
    totalSize += size;
  }

  return shouldSend(totalSize, count, dispatch, getState);
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
  try {
    const readPromises = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      readPromises.push(readFile(file, send));
    }

    return Promise.all(readPromises);
  } catch (exception) {
    throw new Error(`[queue.readFiles] ${exception.message}`);
  }
};

/**
 * Handle upload of files in wait queue and send them to the recipients(send.to)
 * @param  {Object}  send              send.to and send.from for files
 * @param  {Boolean} [addToUser=false] determine if file should be added to current state
 */
export const finishSelectingRecipients = (send, addToUser = false) => async (
  dispatch,
  getState
) => {
  const {
    queue: { waitFiles }
  } = getState();
  try {
    const files = await readFiles(waitFiles, send);

    if (!shouldSendMultiple(files, dispatch, getState)) return;

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

      dispatch(addFileToQueue({ ...dbFile, addToUser, progress: 0 }));
      uploadFile(file, signedRequest, handleProgress, handleFinish);
    }

    dispatch(stopWaiting());
  } catch (exception) {
    console.error(`[queue.finishSelectingRecipients] ${exception.message}`);
    dispatch(finishOnError(exception.message));
  }
};

const postLink = async link => {
  try {
    const response = await callApi('links', link, 'POST');
    return response.json();
  } catch (exception) {
    throw new Error(`[queue.postLink] ${exception.message}`);
  }
};

const getLinkSignedRequest = async () => {
  try {
    const response = await callApi(
      'sign-s3?file-name=FeatherFiles.zip&file-type=application/zip&folder-name=Files'
    );

    return response.json();
  } catch (exception) {
    throw new Error(`[queue.getLinkSignedRequest] ${exception.message}`);
  }
};

const compressFiles = (directoryPath, outputPath) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip');

    archive.pipe(output);
    archive.directory(directoryPath, false);

    output.on('close', () => resolve());
    output.on('error', err => reject(err));

    archive.finalize();
  });

const copyFileAsync = (source, destination) =>
  new Promise((resolve, reject) =>
    fs.copyFile(source, destination, error => {
      if (error) reject(error);
      resolve();
    })
  );

const copyFiles = (files, directoryPath) => {
  const promises = [];
  for (let i = 0; i < files.length; i += 1) {
    const file =
      typeof files[i] === 'string'
        ? {
            path: files[i],
            name: files[i]
              .split('\\')
              .pop()
              .split('/')
              .pop()
          }
        : files[i];

    promises.push(copyFileAsync(file.path, `${directoryPath}${file.name}`));
  }

  return Promise.all(promises);
};

const mkdirAsync = path =>
  new Promise((resolve, reject) =>
    fs.mkdir(path, {}, error => {
      if (error) reject(error);
      resolve();
    })
  );

const deleteDirectories = () => {
  const tempDirectoryPath = remote.app.getPath('temp');
  const directoryPath = `${tempDirectoryPath}FeatherFiles/`;
  const outputPath = `${tempDirectoryPath}FeatherFiles.zip`;

  if (fs.existsSync(directoryPath)) rimraf.sync(directoryPath);
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
};

/**
 * Create a link to send via email, compress waitFiles into a zip and upload that zip.
 * @param  {Object} send Recipients and sender data - send.to and send.from
 */
export const uploadToLink = send => async (dispatch, getState) => {
  const tempDirectoryPath = remote.app.getPath('temp');
  const directoryPath = `${tempDirectoryPath}FeatherFiles/`;
  const outputPath = `${tempDirectoryPath}FeatherFiles.zip`;
  try {
    const {
      queue: { waitFiles }
    } = getState();
    dispatch(setIsLoading(true));
    deleteDirectories();

    await mkdirAsync(directoryPath);
    await copyFiles(waitFiles, directoryPath);
    await compressFiles(directoryPath, outputPath);

    let zipFile = getFileFromPath(outputPath);
    if (!shouldSend(zipFile.size, 1, dispatch, getState)) deleteDirectories();

    const { signedRequest, url } = await getLinkSignedRequest();
    const rdFiles = await readFiles(waitFiles);
    const dbFiles = await postFiles(rdFiles, [{ url }]);

    dispatch(setIsLoading(false));
    dispatch(stopWaiting());

    const fileIDs = dbFiles.map(({ file: { _id } }) => _id);
    const link = {
      ...send,
      files: fileIDs,
      size: zipFile.size,
      s3Url: url,
      type: zipFile.type
    };

    const dbLink = await postLink(link);

    const handleProgress = (id, progress) => {
      dispatch(updateProgress(id, progress));
    };

    const handleFinish = file => {
      dispatch(uploadComplete(file, true));
    };

    dispatch(
      addFileToQueue({ _id: dbLink._id, name: 'FeatherFiles.zip', progress: 0 })
    );

    zipFile = { ...zipFile, id: dbLink._id, progress: 0 };
    uploadFile(zipFile, signedRequest, handleProgress, handleFinish);
  } catch (exception) {
    console.error(exception.message);
    deleteDirectories();
    dispatch(finishOnError(exception.message));
  }
};

const shouldSend = (size, count, dispatch, getState) => {
  const {
    user: { isPro, remainingBytes, remainingFiles }
  } = getState();
  let type = '';

  if (!isPro && size > 2147483648) type = 'fileSize';
  else if (!isPro && remainingFiles - count < 0) type = 'remainingFiles';
  else if (!isPro && size > remainingBytes) type = 'remainingBytes';

  if (isPro && size > 10737418240) {
    dispatch(finishOnError('File exceeds pro limit.'));
    return false;
  }

  if (type) {
    dispatch(displayUpgrade(type));
    dispatch(finishAndClean());
    return false;
  }

  return true;
};
