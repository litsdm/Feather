import { remote } from 'electron';
import fs from 'fs';
import archiver from 'archiver';
import mime from 'mime-types';
import rimraf from 'rimraf';
import callApi, { uploadFile } from '../helpers/apiCaller';
import notify from '../helpers/notifications';
import analytics from '../helpers/analytics';
import { emit } from '../socketClient';
import { updateUserProperty } from './user';
import { displayUpgrade } from './upgrade';

import { addFile } from './file';

export const START_UPLOAD = 'START_UPLOAD';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';
export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';
export const ADD_FILE_TO_QUEUE = 'ADD_FILE_TO_QUEUE';
export const AWAIT_SEND_FOR_FILES = 'AWAIT_SEND_FOR_FILES';
export const STOP_WAITING = 'STOP_WAITING';
export const SET_ADD_FLAG = 'SET_ADD_FLAG';
export const FINISH_AND_CLEAN = 'FINISH_AND_CLEAN';
export const START_SENDING = 'START_SENDING';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const FINISH_SENDING = 'FINISH_SENDING';
export const SET_LINK_URL = 'SET_LINK_URL';

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

const startSending = () => ({
  type: START_SENDING
});

const finishSending = () => ({
  type: FINISH_SENDING
});

const updateStatus = (status, statusProgress = 0) => ({
  status,
  statusProgress,
  type: UPDATE_STATUS
});

const setLinkUrl = url => ({
  url,
  type: SET_LINK_URL
});

const handleFinish = () => (dispatch, getState) => {
  const {
    upload: { queue }
  } = getState();
  dispatch(finishUpload());
  if (queue.length > 0) dispatch(uploadFromQueue());
};

const finishAndClean = () => ({
  type: FINISH_AND_CLEAN
});

const updateProgress = progress => ({
  progress,
  type: UPDATE_UPLOAD_PROGRESS
});

const uploadFromQueue = () => (dispatch, getState) => {
  const {
    upload: { queue, addToUser },
    user: { remainingBytes, remainingFiles }
  } = getState();
  const unwrappedRemainingFiles = remainingFiles || 50;
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

  if (!shouldSend(dispatch, getState, file)) return;

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
          dispatch(
            updateUserProperty('remainingBytes', remainingBytes - file.size)
          );
          dispatch(
            updateUserProperty('remainingFiles', unwrappedRemainingFiles - 1)
          );

          if (localConfig.notifyUpload) {
            notify({
              title: 'File Uploaded',
              body: `${dbFile.name} has finished uploading.`
            });
          }
        }
      );

      analytics.send('event', {
        ec: 'Upload-El',
        ea: 'upload',
        el: `Upload file ${dbFile._id}`
      });

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

export const uploadToLink = send => (dispatch, getState) => {
  const {
    upload: { waitFiles },
    user: { username, remainingBytes, remainingFiles }
  } = getState();
  const unwrappedRemainingFiles = remainingFiles || 50;
  const appTempDirectory = remote.app.getPath('temp');
  const tempDirectoryPath = `${appTempDirectory}FeatherFiles/`;
  const outputPath = `${appTempDirectory}FeatherFiles.zip`;
  const link = { ...send, files: [] };
  let signedReq;

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip');

  dispatch(stopWaiting(false));
  dispatch(startSending());
  dispatch(updateStatus('Creating temporary directory...'));

  archive.pipe(output);

  // Create directory
  fs.mkdirSync(tempDirectoryPath);

  // Copy files to temporary directory
  waitFiles.forEach((file, index) => {
    dispatch(updateStatus('Copying files...', index / (waitFiles.length - 1)));
    fs.copyFileSync(file.path, `${tempDirectoryPath}${file.name}`);
  });

  // Compress temporary directory
  dispatch(updateStatus('Compressing files...'));
  archive.directory(tempDirectoryPath, false);

  output.on('close', () => {
    const zipFile = getFileFromPath(outputPath);

    if (!shouldSend(dispatch, getState, zipFile)) {
      fs.unlinkSync(outputPath);
      rimraf.sync(tempDirectoryPath);
      dispatch(finishSending());
      return;
    }

    dispatch(updateStatus('Preparing upload...'));
    callApi(
      `sign-s3?file-name=FeatherFiles.zip&file-type=application/zip&folder-name=Files`
    )
      .then(res => res.json())
      .then(({ signedRequest, url }) => {
        link.s3Url = url;
        signedReq = signedRequest;
        return Promise.resolve();
      })
      .then(async () => {
        dispatch(updateStatus('Linking files...'));
        const responses = await Promise.all(
          waitFiles.map(({ name, size, type }) => {
            const payload = { name, size, type, isGroup: true };
            return callApi('files', payload, 'POST');
          })
        );
        const dbFiles = await Promise.all(responses.map(res => res.json()));
        const fileIds = dbFiles.map(({ file: { _id } }) => _id);

        link.files = fileIds;
        link.size = zipFile.size;

        return callApi('links', link, 'POST');
      })
      .then(res => res.json())
      .then(({ message, link: dbLink }) => {
        if (message) return Promise.reject(new Error(message));

        uploadFile(
          zipFile,
          signedReq,
          progress => dispatch(updateStatus('Uploading files...', progress)),
          () => {
            dispatch(updateStatus('Finalizing...'));
            callApi(
              'email',
              { to: dbLink.to, endpoint: dbLink._id, from: username },
              'POST'
            );

            dispatch(
              updateUserProperty(
                'remainingBytes',
                remainingBytes - zipFile.size
              )
            );
            dispatch(
              updateUserProperty('remainingFiles', unwrappedRemainingFiles - 1)
            );

            dispatch(finishSending());
            fs.unlinkSync(outputPath);
            rimraf.sync(tempDirectoryPath);

            dispatch(setLinkUrl(`http://www.feathershare.com/${dbLink._id}`));
            document.getElementById('linkModal').style.display = 'flex';
          }
        );

        return Promise.resolve();
      })
      .catch(err => {
        dispatch(finishSending());
        fs.unlinkSync(outputPath);
        rimraf.sync(tempDirectoryPath);
        console.error(err);
      });
  });

  archive.finalize();
};

const shouldSend = (dispatch, getState, file) => {
  const {
    user: { isPro, remainingBytes, remainingFiles }
  } = getState();
  if (!isPro && file.size > 2147483648) {
    dispatch(displayUpgrade('fileSize'));
    dispatch(finishAndClean());
    return false;
  }

  if (!isPro && remainingFiles <= 0) {
    dispatch(displayUpgrade('remainingFiles'));
    dispatch(finishAndClean());
    return false;
  }

  if (file.size > remainingBytes) {
    dispatch(displayUpgrade('remainingBytes'));
    dispatch(finishAndClean());
    return false;
  }

  if (isPro && file.size > 10737418240) {
    dispatch(finishAndClean());
    return false;
  }

  return true;
};
