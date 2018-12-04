import callApi, { uploadFile } from '../helpers/apiCaller';
import notify from '../helpers/notifications';
import { emit } from '../socketClient';

export const START_UPLOAD = 'START_UPLOAD';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';
export const UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';
export const ADD_FILE_TO_QUEUE = 'ADD_FILE_TO_QUEUE';
export const AWAIT_SEND_FOR_FILES = 'AWAIT_SEND_FOR_FILES';
export const STOP_WAITING = 'STOP_WAITING';

export const awaitSendForFiles = waitFiles => ({
  waitFiles,
  type: AWAIT_SEND_FOR_FILES
});

export const uploadWithSend = send => (dispatch, getState) => {
  const {
    upload: { waitFiles }
  } = getState();
  dispatch(stopWaiting());
  dispatch(addFilesToQueue(waitFiles, send));
};

export const stopWaiting = () => ({
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
  if (queue.length > 0) dispatch(uploadFromQueue(dispatch, queue));
};

const updateProgress = progress => ({
  progress,
  type: UPDATE_UPLOAD_PROGRESS
});

const uploadFromQueue = (dispatch, queue) => {
  const rawFile = queue[0];
  const file = {
    name: rawFile.name,
    size: rawFile.size,
    s3Url: '',
    sender: rawFile.send.from,
    receivers: rawFile.send.to,
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
      uploadFile(rawFile, signedReq, updateProgress, () => {
        const localConfig = JSON.parse(localStorage.getItem('localConfig'));

        file.receivers.forEach(receiver =>
          emit('sendFile', { roomId: receiver, file: dbFile })
        );

        dispatch(handleFinish());

        if (localConfig.notifyUpload) {
          notify({
            title: 'File Uploaded',
            body: `${dbFile.name} has finished uploading.`
          });
        }
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
      upload: { isUploading, queue }
    } = getState();
    files.forEach(rawFile => {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(addFileToQueue({ ...rawFile, send }));
        if (!isUploading) dispatch(uploadFromQueue(dispatch, queue, send));
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