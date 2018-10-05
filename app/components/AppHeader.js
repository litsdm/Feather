import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppHeader.scss';

const AppHeader = () => (
  <div className={styles.header}>
    <p className={styles.name}>Feather</p>
    <div className={styles.rightActions}>
      <Link to="/settings" className={styles.settings}>
        <i className="fa fa-cog" />
      </Link>
    </div>
  </div>
);

export default AppHeader;
