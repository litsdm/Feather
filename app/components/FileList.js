import React from 'react';
import uuid from 'uuid/v4';
import { arrayOf, func, object } from 'prop-types';
import { fileType } from '../propTypes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({ downloadFile, downloads, files }) => {
  const renderFiles = () =>
    files.map(({ name, size, createdAt, s3Url, _id }) =>
      <FileRow
        key={uuid()}
        fileName={name}
        size={size}
        date={createdAt}
        url={s3Url}
        downloads={downloads}
        id={_id}
        downloadFile={downloadFile}
      />);

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
  downloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  files: arrayOf(fileType).isRequired
};

export default FileList;
