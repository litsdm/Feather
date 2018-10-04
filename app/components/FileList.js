import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { arrayOf, func, number, object, string } from 'prop-types';
import { fileType } from '../propTypes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({
  downloadFile,
  downloads,
  files,
  uploadId,
  uploadProgress,
  userId,
  removeFile
}) => {
  const renderFiles = () =>
    files.map(({ name, size, s3Url, _id, expiresAt }, index) => (
      <FileRow
        key={uuid()}
        filename={name}
        size={size}
        expiresAt={moment(expiresAt)}
        url={s3Url}
        downloads={downloads}
        id={_id}
        downloadFile={downloadFile}
        uploadId={uploadId}
        uploadProgress={uploadProgress}
        index={index}
        userId={userId}
        removeFile={removeFile}
      />
    ));

  return (
    <div className={styles.container}>
      <p className={styles.title}>Your Files</p>
      <div className={styles.list}>
        {files.length > 0 ? (
          renderFiles()
        ) : (
          <div className={styles.empty}>
            You have no files yet. Drag any file above to upload it.
          </div>
        )}
      </div>
    </div>
  );
};

FileList.propTypes = {
  downloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  files: arrayOf(fileType).isRequired,
  uploadId: string.isRequired,
  uploadProgress: number.isRequired,
  userId: string.isRequired,
  removeFile: func.isRequired
};

export default FileList;
