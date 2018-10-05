import React from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';
import styles from './AppHeader.scss';

const AppHeader = () => (
  <div className={styles.header}>
    <div className={styles.leftActions}>
      <button
        type="button"
        className={styles.quit}
        onClick={() => ipcRenderer.send('quitApp')}
      >
        <i className="fa fa-power-off" />
      </button>
    </div>
    <p className={styles.name}>Feather</p>
    <div className={styles.rightActions}>
      <Link to="/settings" className={styles.settings}>
        <i className="fa fa-cog" />
      </Link>
    </div>
  </div>
);

export default AppHeader;
