import React from 'react';
import styles from './Empty.scss';

const Empty = () => (
  <div className={styles.empty}>
    <p className={styles.title}>It looks like you don&apos;t have any links.</p>
    <p className={styles.description}>
      You can create sharable links for your files. To do this drag your files
      to feather and click on the <i className="fa fa-paperclip" /> icon on the
      top right corner.
    </p>
  </div>
);

export default Empty;
