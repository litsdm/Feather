import React from 'react';
import uuid from 'uuid/v4';
import { arrayOf } from 'prop-types';
import { fileType } from '../propTypes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({ files }) => {
  const renderFiles = () =>
    files.map(({ name, size, createdAt, s3Url }) =>
      <FileRow key={uuid()} fileName={name} size={size} date={createdAt} url={s3Url} />);

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Your Files
      </p>
      <div className={styles.list}>
        {
          files.length > 0
            ? renderFiles()
            : (
              <div className={styles.empty}>
                You have no files yet. Drag any file above to upload it.
              </div>
            )
        }
      </div>
    </div>
  );
};

FileList.propTypes = {
  files: arrayOf(fileType).isRequired
};

export default FileList;
