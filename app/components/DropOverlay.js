import React from 'react';
import { bool } from 'prop-types';
import styles from './DropOverlay.scss';

const DropOverlay = ({ visible }) => (
  <div
    className={styles.overlay}
    style={visible ? { display: 'flex' } : { display: 'none' }}
  >
    <p>Drop your File to Send it</p>
  </div>
);

DropOverlay.propTypes = {
  visible: bool.isRequired
};

export default DropOverlay;
