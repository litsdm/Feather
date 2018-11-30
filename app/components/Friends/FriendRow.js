import React from 'react';
import { string } from 'prop-types';
import styles from './FriendRow.scss';

const FriendRow = ({ name, profilePic, placeholderColor }) => {
  const initials = () => {
    const nameSplit = name.split(' ');
    if (nameSplit.length >= 2)
      return `${nameSplit[0].charAt(0)}${nameSplit[1].charAt(0)}`;
    return nameSplit[0].charAt(0);
  };

  return (
    <button type="button" className={styles.row}>
      <div className={styles.left}>
        {profilePic ? (
          <img src={profilePic} alt={name} className={styles.img} />
        ) : (
          <div
            className={styles.imgPlaceholder}
            style={{ backgroundColor: placeholderColor }}
          >
            <p>{initials()}</p>
          </div>
        )}
        <p className={styles.name}>{name}</p>
      </div>
    </button>
  );
};

FriendRow.propTypes = {
  name: string.isRequired,
  profilePic: string,
  placeholderColor: string
};

FriendRow.defaultProps = {
  profilePic: '',
  placeholderColor: ''
};

export default FriendRow;
