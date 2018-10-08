import React from 'react';
import { bool } from 'prop-types';
import styles from './Loader.scss';

const Loader = ({ small }) => (
  <div className={styles.container} style={small ? { height: '100%' } : {}}>
    <div className={small ? styles.smallEllipsis : styles.idsEllipsis}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

Loader.propTypes = {
  small: bool
};

Loader.defaultProps = {
  small: false
};

export default Loader;
