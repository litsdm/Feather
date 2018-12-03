import React from 'react';
import { bool, func, number, string } from 'prop-types';
import styles from './Row.scss';

import ProfilePic from '../ProfilePic';

const Row = ({
  name,
  profilePic,
  placeholderColor,
  isSelected,
  addFriend,
  removeFriend,
  index
}) => (
  <div className={styles.row}>
    <div className={styles.left}>
      <ProfilePic
        name={name}
        profilePic={profilePic}
        placeholderColor={placeholderColor}
      />
      <p className={styles.name}>{name}</p>
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
  name: string.isRequired,
  profilePic: string,
  placeholderColor: string,
  isSelected: bool,
  addFriend: func.isRequired,
  removeFriend: func.isRequired,
  index: number.isRequired
};

Row.defaultProps = {
  profilePic: '',
  placeholderColor: '',
  isSelected: false
};

export default Row;
