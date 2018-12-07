import React, { Fragment } from 'react';
import moment from 'moment';
import { momentObj } from 'react-moment-proptypes';
import { object, func, number, string } from 'prop-types';
import styles from './FileRow.scss';

import callApi from '../helpers/apiCaller';
import { getFileIcon } from '../helpers/file';
import { emit } from '../socketClient';

import Progressbar from './Progressbar';

const FileRow = ({
  downloads,
  downloadFile,
  filename,
  expiresAt,
  id,
  size,
  url,
  uploadId,
  uploadProgress,
  userId,
  removeFile,
  index
}) => {
  const getState = () => {
    if (typeof downloads[id] !== 'undefined') return 'downloading';
    if (id === uploadId) return 'uploading';

    return 'default';
  };

  const humanFileSize = (bytes, si) => {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return `${bytes} B`;
    }
    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
      bytes /= thresh; // eslint-disable-line
      ++u; // eslint-disable-line
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[u]}`;
  };

  const handleDelete = () => {
    callApi(`${userId}/files/${id}`, {}, 'DELETE')
      .then(res => res.json())
      .then(({ message, shouldDeleteS3 }) => {
        if (message) return Promise.reject(new Error(message));

        if (shouldDeleteS3) {
          callApi('delete-s3', { filename }, 'POST')
            .then(({ status }) => {
              if (status !== 200) return Promise.reject();
              removeFile(index);
              emit('removeFileFromRoom', { roomId: userId, index });
              return Promise.resolve();
            })
            .catch(err => console.error(err.message));
        } else {
          removeFile(index);
          emit('removeFileFromRoom', { roomId: userId, index });
        }

        return Promise.resolve();
      })
      .catch(err => console.error(err.message));
  };

  const state = getState();
  const fileIcon = getFileIcon(filename);

  const renderInfoSection = () => {
    if (state === 'downloading')
      return <Progressbar progress={downloads[id].progress} action={state} />;
    if (state === 'uploading')
      return <Progressbar progress={uploadProgress} action={state} />;

    return (
      <Fragment>
        <p className={styles.expiry}>Expires {moment().to(expiresAt)}</p>
        <p className={styles.size}>{humanFileSize(size, true)}</p>
      </Fragment>
    );
  };

  return (
    <div className={styles.row}>
      <div className={styles.top}>
        <div className={styles.info}>
          <i className={fileIcon.icon} style={{ color: fileIcon.color }} />
          <p className={styles.name}>{filename}</p>
        </div>
        {state === 'default' ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.download}
              onClick={() => downloadFile(id, url, filename)}
            >
              <i className="fa fa-download" />
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={handleDelete}
            >
              <i className="fa fa-trash-alt" />
            </button>
          </div>
        ) : null}
      </div>
      <div className={styles.bottom}>{renderInfoSection()}</div>
    </div>
  );
};

FileRow.propTypes = {
  downloads: object.isRequired, // eslint-disable-line
  downloadFile: func.isRequired,
  expiresAt: momentObj.isRequired,
  filename: string.isRequired,
  id: string.isRequired,
  index: number.isRequired,
  removeFile: func.isRequired,
  size: number.isRequired,
  uploadId: string.isRequired,
  uploadProgress: number.isRequired,
  userId: string.isRequired,
  url: string.isRequired
};

export default FileRow;
