import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import { arrayOf, func, number, object, string } from 'prop-types';
import { fileShape } from '../shapes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({
  downloadFile,
  downloads,
  files,
  uploadId,
  uploadProgress,
  userId,
  removeFile,
  uploadToPersonal
}) => {
  const handleDrop = acceptedFiles => {
    const send = {
      from: userId,
      to: [userId]
    };

    uploadToPersonal(acceptedFiles, send);
  };

  const renderFiles = () =>
    files.map(({ name, size, s3Url, _id, expiresAt }, index) =>
      moment().diff(expiresAt) < 0 ? (
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
      ) : null
    );

  return (
    <div className={styles.container}>
      <p className={styles.title}>Your Files</p>
      <Dropzone onDrop={handleDrop} disabled>
        {({ getRootProps, isDragActive }) => (
          <div className={styles.list} {...getRootProps()}>
            <div
              className={styles.dropOverlay}
              style={isDragActive ? { display: 'flex' } : {}}
            >
              <p>
                Upload to <b>Your Files</b>
              </p>
            </div>
            {files.length > 0 ? (
              renderFiles()
            ) : (
              <div className={styles.empty}>
                <p>You have no files yet. Drag any file above to upload it.</p>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

FileList.propTypes = {
  downloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  files: arrayOf(fileShape).isRequired,
  uploadId: string.isRequired,
  uploadProgress: number.isRequired,
  userId: string.isRequired,
  removeFile: func.isRequired,
  uploadToPersonal: func.isRequired
};

export default FileList;
