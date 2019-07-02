import React from 'react';
import moment from 'moment';
import { momentObj } from 'react-moment-proptypes';
import { func, number, string } from 'prop-types';
import styles from './FileRow.scss';

import callApi from '../../helpers/apiCaller';
import { getFileIcon } from '../../helpers/file';
import analytics from '../../helpers/analytics';
import { emit } from '../../socketClient';

const FileRow = ({
  downloadFile,
  filename,
  expiresAt,
  id,
  url,
  userId,
  removeFile,
  index
}) => {
  const handleDownload = () => {
    analytics.send('event', {
      ec: 'File-El',
      ea: 'download',
      el: `Download file ${id}`
    });
    downloadFile(id, url, filename);
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

        analytics.send('event', {
          ec: 'File-El',
          ea: 'delete',
          el: 'Delete file'
        });

        return Promise.resolve();
      })
      .catch(err => console.error(err.message));
  };

  const fileIcon = getFileIcon(filename);

  return (
    <div className={styles.item}>
      <div className={styles.square}>
        <div className={styles.overlay}>
          <div className={styles.overlayCol}>
            <button
              type="button"
              className={styles.downloadButton}
              onClick={handleDownload}
            >
              <i className="fas fa-long-arrow-alt-down" />
            </button>
            Download
          </div>
          <div className={styles.overlayCol}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              <i className="far fa-trash-alt" />
            </button>
            Delete
          </div>
        </div>
        <div
          className={styles.innerSquare}
          style={{ backgroundColor: fileIcon.color }}
        />
        <i
          className={`${styles.centerIcon} ${fileIcon.icon}`}
          style={{ color: fileIcon.color }}
        />
      </div>
      <div>
        <p className={styles.name}>{filename}</p>
        <p className={styles.expiry}>Expires {moment().to(expiresAt)}</p>
      </div>
    </div>
  );
};

FileRow.propTypes = {
  downloadFile: func.isRequired,
  expiresAt: momentObj.isRequired,
  filename: string.isRequired,
  id: string.isRequired,
  index: number.isRequired,
  removeFile: func.isRequired,
  userId: string.isRequired,
  url: string.isRequired
};

export default FileRow;
