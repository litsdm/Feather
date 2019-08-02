/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { func, number, string } from 'prop-types';
import styles from './FriendRow.scss';

import ProfilePic from '../ProfilePic';

const FriendRow = ({
  username,
  profilePic,
  placeholderColor,
  index,
  resolveRequest,
  reqId
}) => (
  <div className={styles.row}>
    <div className={styles.left}>
      <ProfilePic
        username={username}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name} style={reqId ? { maxWidth: '168px' } : {}}>
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
);

FriendRow.propTypes = {
  username: string.isRequired,
  profilePic: string,
  placeholderColor: string,
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
