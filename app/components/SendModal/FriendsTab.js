import React from 'react';
import uuid from 'uuid/v4';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { userShape } from '../../shapes';
import styles from './FriendsTab.scss';

import ProfilePic from '../ProfilePic';

const FriendRow = ({ friend, isSelected, select }) => (
  <div className={styles.row}>
    <div className={styles.info}>
      <ProfilePic {...friend} />
      <p>{friend.username}</p>
    </div>
    <button
      type="button"
      className={isSelected ? styles.remove : styles.add}
      onClick={select(friend._id)}
    >
      {isSelected ? 'Remove' : 'Add'}
    </button>
  </div>
);

FriendRow.propTypes = {
  friend: userShape.isRequired,
  isSelected: bool.isRequired,
  select: func.isRequired
};

const FriendsTab = ({ friends, selectedFriends, select, userID }) => {
  const isUserSelected = selectedFriends[userID] === 1;

  const renderFriends = () =>
    friends.map(friend => {
      const isSelected = selectedFriends[friend._id] === 1;
      return (
        <FriendRow
          key={uuid()}
          friend={friend}
          isSelected={isSelected}
          select={select}
        />
      );
    });

  return (
    <div className={styles.friends}>
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.folderIcon}>
            <i className="fas fa-folder" />
          </div>
          <p className={styles.name}>My Files</p>
        </div>
        <button
          type="button"
          className={isUserSelected ? styles.remove : styles.add}
          onClick={select(userID)}
        >
          {isUserSelected ? 'Remove' : 'Add'}
        </button>
      </div>
      {renderFriends()}
    </div>
  );
};

FriendsTab.propTypes = {
  friends: arrayOf(userShape),
  select: func.isRequired,
  userID: string.isRequired,
  selectedFriends: object // eslint-disable-line react/forbid-prop-types
};

FriendsTab.defaultProps = {
  friends: [],
  selectedFriends: {}
};

export default FriendsTab;
