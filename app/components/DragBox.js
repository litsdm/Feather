import React from 'react';
import Dropzone from 'react-dropzone';
import { bool, func, string } from 'prop-types';
import styles from './DragBox.scss';

import callApi, { uploadFile } from '../helpers/apiCaller';
import { emit } from '../socketClient';

let uploadQueue = [];

const DragBox = ({ addFile, isUploading, finishUpload, updateProgress, userId }) => {
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          uploadQueue = [...uploadQueue, file];
          if (!isUploading) uploadFromQueue();
        };
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        reader.readAsDataURL(file);
    });
  };

  const uploadFromQueue = () => {
    const rawFile = uploadQueue.shift();
    const file = constructFile(rawFile);
    const type = rawFile.type.replace('+', '%2B');
    let signedReq;

    // save file object to DB;
    callApi(`sign-s3?file-name=${rawFile.name}&file-type=${type}&folder-name=Files`)
      .then(res => res.json())
      .then(({ signedRequest, url }) => {
        file.s3Url = url;
        signedReq = signedRequest;
        return callApi(`${userId}/files`, file, 'POST');
      })
      .then(res => res.json())
      .then(({ file: dbFile }) => {
        addFile(dbFile, true);
        uploadFile(rawFile, signedReq, updateProgress, () => {
          emit('sendFile', { userId, file: dbFile });
          handleFinish();
        });
        return Promise.resolve();
      })
      .catch(() => {
        console.log('upload error');
      });
  }

  const handleFinish = () => {
    finishUpload();
    if (uploadQueue.length > 0) {
      uploadFromQueue();
    }
  }

  const constructFile = ({ name, size }) => ({
    name,
    s3Url: '',
    size,
    sender: userId
  });

  return (
    <div className={styles.dragBox}>
      <Dropzone
        onDrop={onDrop}
        className={styles.dropZone}
        activeClassName={styles.dropZoneActive}
        maxSize={2147483648}
      >
        <b style={{ marginRight: '4px' }}>
          Choose a file
        </b>
        or drag it here.
      </Dropzone>
    </div>
  );
};

DragBox.propTypes = {
  addFile: func.isRequired,
  finishUpload: func.isRequired,
  updateProgress: func.isRequired,
  isUploading: bool.isRequired,
  userId: string.isRequired
}

export default DragBox;
