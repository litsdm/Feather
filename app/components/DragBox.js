import React from 'react';
import Dropzone from 'react-dropzone';
import { bool, func, string } from 'prop-types';
import styles from './DragBox.scss';

import callApi, { uploadFile } from '../helpers/apiCaller';

let uploadQueue = [];

const DragBox = ({ addFile, isUploading, finishUpload, updateProgress, userId }) => {
  const onDrop = (acceptedFiles) => {
    uploadQueue = [...uploadQueue, acceptedFiles];
    if (!isUploading) uploadFromQueue();
  };

  const uploadFromQueue = () => {
    const rawFile = uploadQueue.shift();
    const file = constructFile(rawFile);
    let signedReq;

    // save file object to DB;
    callApi(`sign-s3?file-name=${rawFile.name}&file-type=${rawFile.type}&folder-name=GameBuilds`)
      .then(res => res.json())
      .then(({ signedRequest, url }) => {
        file.s3Url = url;
        signedReq = signedRequest;
        return uploadFileToDB(file);
      })
      .then(({ file: dbFile }) => {
        addFile(dbFile, true);
        uploadFile(rawFile, signedReq, updateProgress, handleFinish);
        return Promise.resolve();
      })
      .catch(() => {
        console.log('upload error');
      });
  }

  const uploadFileToDB = file => callApi(`${userId}/files`, file, 'POST')
    .then(res => res.json())
    .then(({ status }) => {
      if (status !== 200) return Promise.reject();
      return Promise.resolve();
    });

  const handleFinish = () => {
    finishUpload();
    if (uploadQueue.length > 0) {
      uploadFromQueue();
    }
  }

  const constructFile = ({ name, size }) => ({
    name,
    s3Url: '',
    size
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
