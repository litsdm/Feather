import React from 'react';
import { string } from 'prop-types';
import styles from './Badge.scss';

const Badge = ({ error }) => (
  <div className={`${styles.badgeNotification} ${error ? styles.display : ''}`}>
    <p>{error}</p>
  </div>
);

Badge.propTypes = {
  error: string
};

Badge.defaultProps = {
  error: null
};

export default Badge;
