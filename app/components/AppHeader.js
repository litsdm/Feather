import React from 'react';
import { ipcRenderer, remote } from 'electron';
import { Link } from 'react-router-dom';
import styles from './AppHeader.scss';

const AppHeader = () => {
  const handleClose = () => {
    const win = remote.getCurrentWindow();
    win.close();
  };

  const handleMinimize = () => {
    const win = remote.getCurrentWindow();
    win.minimize();
  };

  const renderSettingsLink = () => (
    <Link to="/settings" className={styles.settings}>
      <i className="fa fa-cog" />
    </Link>
  );

  const renderHeader = () => (
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
      <div className={styles.rightActions}>{renderSettingsLink()}</div>
    </div>
  );

  return process.platform === 'darwin' ? (
    renderHeader()
  ) : (
    <div className={styles.headerWrapper}>
      <div className={styles.dragZone}>
        <p className={styles.windowsTitle}>
          <i className="fa fa-feather-alt" />
          Feather
        </p>
        <div className={styles.controls}>
          <div className={styles.otherControls}>{renderSettingsLink()}</div>
          <div className={styles.divider} />
          <div className={styles.windowsControls}>
            <button type="button" onClick={handleMinimize}>
              <span>&#xE921;</span>
            </button>
            <button
              type="button"
              className={styles.close}
              onClick={handleClose}
            >
              <span>&#xE8BB;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
