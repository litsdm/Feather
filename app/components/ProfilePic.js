import React from 'react';
import { string, object } from 'prop-types';
import styles from './ProfilePic.scss';

import { initials } from '../helpers/string';

const ProfilePic = ({
  username,
  placeholderColor,
  profilePic,
  picStyle,
  phStyle
}) =>
  profilePic ? (
    <img
      src={profilePic}
      alt={username}
      className={styles.img}
      style={picStyle}
    />
  ) : (
    <div
      className={styles.imgPlaceholder}
      style={{ backgroundColor: placeholderColor, ...picStyle }}
    >
      <p style={phStyle}>{initials(username)}</p>
    </div>
  );

ProfilePic.propTypes = {
  username: string,
  placeholderColor: string.isRequired,
  profilePic: string,
  picStyle: object, // eslint-disable-line react/forbid-prop-types
  phStyle: object // eslint-disable-line react/forbid-prop-types
};

ProfilePic.defaultProps = {
  username: '',
  profilePic: '',
  picStyle: {},
  phStyle: {}
};

export default ProfilePic;
