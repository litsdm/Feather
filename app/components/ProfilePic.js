import React from 'react';
import { string, object } from 'prop-types';
import styles from './ProfilePic.scss';

import { initials } from '../helpers/string';

const ProfilePic = ({
  name,
  placeholderColor,
  profilePic,
  picStyle,
  phStyle
}) =>
  profilePic ? (
    <img src={profilePic} alt={name} className={styles.img} style={picStyle} />
  ) : (
    <div
      className={styles.imgPlaceholder}
      style={{ backgroundColor: placeholderColor, ...picStyle }}
    >
      <p style={phStyle}>{initials(name)}</p>
    </div>
  );

ProfilePic.propTypes = {
  name: string,
  placeholderColor: string.isRequired,
  profilePic: string,
  picStyle: object, // eslint-disable-line react/forbid-prop-types
  phStyle: object // eslint-disable-line react/forbid-prop-types
};

ProfilePic.defaultProps = {
  name: '',
  profilePic: '',
  picStyle: {},
  phStyle: {}
};

export default ProfilePic;
