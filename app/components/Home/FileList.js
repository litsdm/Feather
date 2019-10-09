import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { arrayOf, func, shape, string } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './FileList.scss';

import FileRow from './FileRow';
import Empty from './Empty';

const FileList = ({
  downloadFile,
  files,
  userId,
  removeFile,
  dlFiles,
  removeDlPath
}) => {
  const renderFiles = () =>
    files.map(({ name, s3Filename, _id, expiresAt, from }, index) =>
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
          dlFiles={dlFiles}
          removeDlPath={removeDlPath}
          from={from}
        />
      ) : null
    );

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {files.length > 0 ? renderFiles() : <Empty />}
      </div>
    </div>
  );
};

FileList.propTypes = {
  downloadFile: func.isRequired,
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  removeFile: func.isRequired,
  dlFiles: shape({ fileID: string }),
  removeDlPath: func.isRequired
};

FileList.defaultProps = {
  dlFiles: {}
};

export default FileList;
