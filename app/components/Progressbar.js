import React from 'react';
import { number, string } from 'prop-types';
import styles from './Progressbar.scss';

const Progressbar = ({ progress, action }) => (
  <div className={styles.container}>
    <i
      className={
        action === 'downloading'
          ? 'fa fa-cloud-download-alt'
          : 'fa fa-cloud-upload-alt'
      }
    />
    <div className={styles.backgroundBar}>
      <div
        className={styles.progress}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
    <p>{`${Math.floor(progress * 100)}%`}</p>
  </div>
);

Progressbar.propTypes = {
  progress: number,
  action: string
};

Progressbar.defaultProps = {
  progress: 0,
  action: 'downloading'
};

export default Progressbar;
