import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './FileList.scss';

import FileRow from './FileRow';
import Empty from './Empty';

const FileList = ({
  downloadFile,
  files,
  userId,
  removeFile,
  removeSentFile,
  dlFiles,
  removeDlPath,
  sent
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
          removeSentFile={removeSentFile}
          dlFiles={dlFiles}
          removeDlPath={removeDlPath}
          from={from}
          sent={sent}
        />
      ) : null
    );

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {files.length > 0 ? renderFiles() : <Empty sent={sent} />}
      </div>
    </div>
  );
};

FileList.propTypes = {
  downloadFile: func.isRequired,
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  removeFile: func.isRequired,
  removeSentFile: func.isRequired,
  dlFiles: shape({ fileID: string }),
  sent: bool.isRequired,
  removeDlPath: func.isRequired
};

FileList.defaultProps = {
  dlFiles: {}
};

export default FileList;
