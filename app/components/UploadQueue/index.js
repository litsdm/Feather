import React from 'react';
import uuid from 'uuid/v4';
import { arrayOf, number } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './styles.scss';

import CircleProgress from './CircleProgress';
import FileItem from './FileItem';

const UploadQueue = ({ queue, file, progress }) => {
  const renderFileItems = () =>
    queue.map(({ name }) => <FileItem key={uuid()} filename={name} />);

  return (
    <div
      className={`${styles.queue} ${
        queue.length > 0 || file ? styles.display : ''
      }`}
    >
      <div className={styles.info}>
        <p className={styles.status}>Sending files...</p>
        <p className={styles.progress}>{`${Math.round(progress * 100)}%`}</p>
        <p className={styles.count}>
          {queue.length + 1} <span>remaining</span>
        </p>
      </div>
      <div
        className={styles.list}
        style={{ transform: `translate(-${50 / (queue.length + 1)}%, -50%)` }}
      >
        {file && Object.prototype.hasOwnProperty.call(file, 'name') ? (
          <div className={styles.uploading}>
            <CircleProgress
              percentage={progress * 100}
              sqSize={48}
              strokeWidth={3}
            />
            <FileItem filename={file.name} isUploading />
          </div>
        ) : null}
        {renderFileItems()}
      </div>
    </div>
  );
};

UploadQueue.propTypes = {
  queue: arrayOf(fileShape),
  file: fileShape,
  progress: number
};

UploadQueue.defaultProps = {
  queue: [],
  file: null,
  progress: 0
};

export default UploadQueue;
