import React from 'react';
import Dropzone from 'react-dropzone';
import { bool, func } from 'prop-types';
import styles from './DragBox.scss';

import callApi, { uploadFile } from '../helpers/apiCaller';

const DragBox = ({ addFile, isUploading }) => {
  let uploadQueue = [];

  const onDrop = (acceptedFiles) => {
    uploadQueue = [...uploadQueue, acceptedFiles];
    if (!isUploading) uploadFromQueue();
  };

  const uploadFromQueue = () => {
    const rawFile = uploadQueue.shift();
    const file = constructFile();
    console.log(rawFile);
    addFile(file, true);

    // save file object to DB;
    callApi(`sign-s3?file-name=${rawFile.name}&file-type=${rawFile.type}&folder-name=GameBuilds`)
      .then(res => res.json())
      .then(({ signedRequest, url }) => {
        file.s3Url = url;
        return uploadFile(rawFile, signedRequest);
      })
      .then(res => {
        if (res.status !== 200) return Promise.reject();
        return uploadFileToDB(file);
      })
      .then(() => {
        if (uploadQueue.length > 0) {
          uploadFromQueue();
        }

        return Promise.resolve();
      })
      .catch(() => {
        console.log('upload error');
      });
  }

  const uploadFileToDB = file => callApi('file/new', file, 'POST')
    .then(res => res.json())
    .then(({ status }) => {
      if (status !== 200) return Promise.reject();
      return Promise.resolve();
    });

  const constructFile = (rawFile) => ({
    createdAt: new Date(),
    rawFile,
    state: 'Uploading',
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
  isUploading: bool.isRequired
}

export default DragBox;
