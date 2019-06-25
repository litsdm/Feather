import React from 'react';
import { number, string } from 'prop-types';
import styles from './row.scss';

const Row = ({ name, progress }) => (
  <div className={styles.row}>
    <div className={styles.left}>
      <p className={styles.name}>{name}</p>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
    </div>
    <p className={styles.percentage}>{progress}%</p>
  </div>
);

Row.propTypes = {
  name: string.isRequired,
  progress: number
};

Row.defaultProps = {
  progress: 0
};

export default Row;
