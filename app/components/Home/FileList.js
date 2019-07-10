import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { arrayOf, func, string } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({ downloadFile, files, userId, removeFile }) => {
  const renderFiles = () =>
    files.map(({ name, s3Filename, _id, expiresAt }, index) =>
      moment().diff(expiresAt) < 0 ? (
        <FileRow
          key={uuid()}
          filename={name}
          expiresAt={moment(expiresAt)}
          s3Filename={s3Filename}
          id={_id}
          downloadFile={downloadFile}
          index={index}
          userId={userId}
          removeFile={removeFile}
        />
      ) : null
    );

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {files.length > 0 ? (
          renderFiles()
        ) : (
          <div className={styles.empty}>
            <p>You have no files yet. Drag any file above to upload it.</p>
          </div>
        )}
      </div>
    </div>
  );
};

FileList.propTypes = {
  downloadFile: func.isRequired,
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  removeFile: func.isRequired
};

export default FileList;
