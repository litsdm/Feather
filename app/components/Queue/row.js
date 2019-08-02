import React from 'react';
import { number, string } from 'prop-types';
import styles from './row.scss';

const Row = ({ name, progress, type }) => {
  const iconClass = () => {
    const icon = `fas fa-long-arrow-alt-${type === 'download' ? 'down' : 'up'}`;
    const style = type === 'download' ? styles.downIcon : styles.upIcon;
    return `${icon} ${style}`;
  };

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <p className={styles.name}>{name}</p>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={styles.right}>
        <i className={iconClass()} />
        <p className={styles.percentage}>{progress}%</p>
      </div>
    </div>
  );
};

Row.propTypes = {
  name: string.isRequired,
  type: string.isRequired,
  progress: number
};

Row.defaultProps = {
  progress: 0
};

export default Row;
