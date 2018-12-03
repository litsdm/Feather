import React from 'react';
import { string } from 'prop-types';
import styles from './FriendRow.scss';

import ProfilePic from '../ProfilePic';

const FriendRow = ({ _id, name, profilePic, placeholderColor }) => (
  <label htmlFor={`friendFile-${_id}`} className={styles.row}>
    <div className={styles.left}>
      <ProfilePic
        name={name}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name}>{name}</p>
    </div>
    <input id={`friendFile-${_id}`} type="file" className={styles.fileInput} />
  </label>
);

FriendRow.propTypes = {
  name: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  _id: string.isRequired
};

FriendRow.defaultProps = {
  profilePic: '',
  placeholderColor: ''
};

export default FriendRow;
