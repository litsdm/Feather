import React from 'react';
import { bool, number, string } from 'prop-types';
import styles from './styles.scss';

import RippleLoader from './RippleLoader';

const LinkProgress = ({ visible, status, progress }) => (
  <div className={`${styles.container} ${visible ? styles.display : ''}`}>
    <div className={styles.loaderWrapper}>
      <i className="fas fa-envelope" />
      <RippleLoader />
    </div>
    <p className={styles.status}>
      {`${status}${progress ? ` - ${Math.round(progress * 100)}%` : ''}`}
    </p>
  </div>
);

LinkProgress.propTypes = {
  visible: bool.isRequired,
  status: string,
  progress: number
};

LinkProgress.defaultProps = {
  status: '',
  progress: 0
};

export default LinkProgress;
