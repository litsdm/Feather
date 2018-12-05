import React from 'react';
import { string } from 'prop-types';
import styles from './FriendRow.scss';

import ProfilePic from '../ProfilePic';

const FriendRow = ({ _id, username, profilePic, placeholderColor }) => (
  <label htmlFor={`friendFile-${_id}`} className={styles.row}>
    <div className={styles.left}>
      <ProfilePic
        username={username}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name}>{username}</p>
    </div>
    <input id={`friendFile-${_id}`} type="file" className={styles.fileInput} />
  </label>
);

FriendRow.propTypes = {
  username: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  _id: string.isRequired
};

FriendRow.defaultProps = {
  profilePic: '',
  placeholderColor: ''
};

export default FriendRow;
