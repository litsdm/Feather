/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
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
  reqId
}) => (
  <label
    htmlFor={`friendFile-${_id}`}
    className={styles.row}
    style={reqId ? { cursor: 'auto' } : {}}
  >
    <div className={styles.left}>
      <ProfilePic
        username={username}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name}>{username}</p>
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
    {reqId ? null : (
      <input
        id={`friendFile-${_id}`}
        type="file"
        className={styles.fileInput}
      />
    )}
  </label>
);

FriendRow.propTypes = {
  username: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  _id: string.isRequired,
  index: number,
  resolveRequest: func,
  reqId: string
};

FriendRow.defaultProps = {
  profilePic: '',
  placeholderColor: '',
  index: 0,
  resolveRequest: () => {},
  reqId: ''
};

export default FriendRow;
