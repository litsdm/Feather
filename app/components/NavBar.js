import React, { Fragment } from 'react';
import { ipcRenderer, remote } from 'electron';
import { Link } from 'react-router-dom';
import { bool, string, object } from 'prop-types';
import styles from './NavBar.scss';

const NavBar = ({ pathname, history, requestIndicator, updateAvailable }) => {
  const handleClose = () => {
    const win = remote.getCurrentWindow();
    win.close();
  };

  const handleMinimize = () => {
    const win = remote.getCurrentWindow();
    win.minimize();
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const renderNavButton = () =>
    pathname !== '/' ? (
      <button type="button" className={styles.quit} onClick={handleGoBack}>
        <i className="fa fa-arrow-left" />
      </button>
    ) : (
      <button
        type="button"
        className={styles.quit}
        onClick={() => ipcRenderer.send('quitApp')}
      >
        <i className="fa fa-power-off" />
      </button>
    );

  const renderMainControls = () => (
    <Fragment>
      {updateAvailable ? (
        <button
          type="button"
          className={styles.update}
          onClick={() => ipcRenderer.send('quitAndInstall')}
        >
          <i className="fas fa-long-arrow-alt-down" />
          <div />
        </button>
      ) : null}
      <Link
        to="/friends"
        className={styles.settings}
        style={{ marginRight: '12px', position: 'relative' }}
      >
        {requestIndicator ? <div className={styles.indicator} /> : null}
        <i className="fa fa-users" />
      </Link>
      <Link to="/settings" className={styles.settings}>
        <i className="fa fa-cog" />
      </Link>
    </Fragment>
  );

  const getConfig = () => {
    switch (pathname) {
      case '/friends':
        return {
          title: 'Friends',
          controlsRight: null
        };
      default:
        return {
          title: 'Feather',
          controlsRight: renderMainControls()
        };
    }
  };

  const config = getConfig();

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.leftActions}>{renderNavButton()}</div>
      <p className={styles.name}>{config.title}</p>
      <div className={styles.rightActions}>{config.controlsRight}</div>
    </div>
  );

  return process.platform === 'darwin' ? (
    renderHeader()
  ) : (
    <div className={styles.headerWrapper}>
      <div className={styles.dragZone}>
        {pathname === '/friends' ? (
          <button type="button" className={styles.quit} onClick={handleGoBack}>
            <i className="fa fa-arrow-left" />
          </button>
        ) : (
          <p className={styles.windowsTitle}>
            <i className="fa fa-feather-alt" />
            Feather
          </p>
        )}
        <div className={styles.controls}>
          <div className={styles.otherControls}>{config.controlsRight}</div>
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

NavBar.propTypes = {
  pathname: string.isRequired,
  requestIndicator: bool.isRequired,
  updateAvailable: bool.isRequired,
  history: object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default NavBar;
