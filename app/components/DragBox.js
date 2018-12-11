import React from 'react';
import Dropzone from 'react-dropzone';
import { func } from 'prop-types';
import styles from './DragBox.scss';

const DragBox = ({ awaitSendForFiles }) => {
  const onDrop = acceptedFiles => {
    awaitSendForFiles(acceptedFiles);
  };

  return (
    <div className={styles.dragBox}>
      <Dropzone onDrop={onDrop} maxSize={2147483648}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={`${styles.innerDrop} ${
              isDragActive ? styles.active : ''
            }`}
          >
            <input {...getInputProps()} />
            <div
              className={`${styles.bordered} ${
                isDragActive ? styles.active : ''
              }`}
            >
              <b style={{ marginRight: '4px' }}>Choose a file</b>
              or drag it here.
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

DragBox.propTypes = {
  awaitSendForFiles: func.isRequired
};

export default DragBox;
