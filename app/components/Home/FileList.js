import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { arrayOf, func, string } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './FileList.scss';

import FileRow from './FileRow';

const tempFiles = [
  {
    name: 'pic.png',
    size: 1234,
    s3Url: 'tempUrl.com',
    _id: 'rand-1',
    expiresAt: moment().add(1, 'days')
  },
  {
    name: 'audio.mp3',
    size: 1234,
    s3Url: 'tempUrl.com',
    _id: 'rand-2',
    expiresAt: moment().add(1, 'days')
  },
  {
    name: 'video.mp4',
    size: 1234,
    s3Url: 'tempUrl.com',
    _id: 'rand-3',
    expiresAt: moment().add(1, 'days')
  },
  {
    name: 'code.js',
    size: 1234,
    s3Url: 'tempUrl.com',
    _id: 'rand-4',
    expiresAt: moment().add(1, 'days')
  }
];

const FileList = ({ downloadFile, files, userId, removeFile }) => {
  const renderFiles = () =>
    tempFiles.map(({ name, s3Url, _id, expiresAt }, index) =>
      moment().diff(expiresAt) < 0 ? (
        <FileRow
          key={uuid()}
          filename={name}
          expiresAt={moment(expiresAt)}
          url={s3Url}
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
        {tempFiles.length > 0 ? (
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
