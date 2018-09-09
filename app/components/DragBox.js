import React from 'react';
import Dropzone from 'react-dropzone';
import { bool, func } from 'prop-types';
import styles from './DragBox.scss';

import { uploadFile } from '../helpers/apiCaller';

const DragBox = ({ addFile, isUploading }) => {
  let uploadQueue = [];

  const onDrop = (acceptedFiles) => {
    uploadQueue = [...uploadQueue, acceptedFiles];
    if (!isUploading) uploadFromQueue();
  };

  const uploadFromQueue = () => {
    const rawFile = uploadQueue.shift();
    const file = constructFile();
    addFile(file, true);

    uploadFile(rawFile, () => {
      if (uploadQueue.length > 0) {
        uploadFromQueue();
      }
    });
  }

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
