/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import Dropzone from 'react-dropzone';
import { func, number, string } from 'prop-types';
import styles from './FriendRow.scss';

import ProfilePic from '../ProfilePic';

const FriendRow = ({
  _id,
  username,
  profilePic,
  placeholderColor,
  index,
  resolveRequest,
  reqId,
  sendFiles
}) => {
  const onDrop = acceptedFiles => {
    sendFiles(acceptedFiles, [_id]);
  };

  return (
    <Dropzone
      onDrop={onDrop}
      disabled={reqId === '' || reqId === null || reqId === undefined}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          className={`${styles.row} ${isDragActive ? styles.active : ''}`}
          style={reqId ? { cursor: 'auto' } : {}}
          {...getRootProps()}
        >
          {reqId ? null : <input {...getInputProps()} />}
          <div className={styles.left}>
            <ProfilePic
              username={username}
              profilePic={profilePic}
              placeholderColor={placeholderColor}
            />
            <p
              className={styles.name}
              style={reqId ? { maxWidth: '168px' } : {}}
            >
              {username}
            </p>
          </div>
          {reqId ? (
            <div className={styles.right}>
              <button
                type="button"
                className={styles.reject}
                onClick={resolveRequest(reqId, index, 'reject')}
              >
                <i className="fa fa-times" />
              </button>
              <button
                type="button"
                className={styles.accept}
                onClick={resolveRequest(reqId, index, 'accept')}
              >
                <i className="fa fa-check" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </Dropzone>
  );
};

FriendRow.propTypes = {
  username: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  _id: string.isRequired,
  index: number,
  resolveRequest: func,
  reqId: string,
  sendFiles: func
};

FriendRow.defaultProps = {
  profilePic: '',
  placeholderColor: '',
  index: 0,
  resolveRequest: () => {},
  sendFiles: () => {},
  reqId: ''
};

export default FriendRow;
