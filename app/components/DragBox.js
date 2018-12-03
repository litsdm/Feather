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
      <Dropzone
        onDrop={onDrop}
        className={styles.dropZone}
        activeClassName={styles.dropZoneActive}
        maxSize={2147483648}
      >
        <b style={{ marginRight: '4px' }}>Choose a file</b>
        or drag it here.
      </Dropzone>
    </div>
  );
};

DragBox.propTypes = {
  awaitSendForFiles: func.isRequired
};

export default DragBox;
