import React from 'react';
import { bool, func, number, string } from 'prop-types';
import styles from './Row.scss';

import ProfilePic from '../ProfilePic';

const Row = ({
  username,
  profilePic,
  placeholderColor,
  isSelected,
  addFriend,
  removeFriend,
  index,
  displayUsername
}) => (
  <div className={styles.row}>
    <div className={styles.left}>
      <ProfilePic
        username={username}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name}>{displayUsername || username}</p>
    </div>
    <div className={styles.right}>
      {isSelected ? (
        <button
          type="button"
          className={styles.remove}
          onClick={removeFriend(index)}
        >
          Remove
        </button>
      ) : (
        <button type="button" className={styles.add} onClick={addFriend(index)}>
          Add
        </button>
      )}
    </div>
  </div>
);

Row.propTypes = {
  username: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  isSelected: bool,
  addFriend: func.isRequired,
  removeFriend: func.isRequired,
  index: number.isRequired,
  displayUsername: string
};

Row.defaultProps = {
  profilePic: '',
  placeholderColor: '',
  isSelected: false,
  displayUsername: ''
};

export default Row;
