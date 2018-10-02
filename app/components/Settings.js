import React from 'react';
import { bool, func, string } from 'prop-types';
import styles from './Settings.scss';

const Settings = ({
  downloadPath,
  email,
  notifyDownload,
  notifyUpload,
  notifyReceived,
  username,
  setState,
  goToPath,
  logout
}) => {
  const handleChange = ({ target: { name, value, type, checked } }) => {
    const newValue = type === 'checkbox' ? checked : value;
    setState({ [name]: newValue });
  }

  const handleDirectorySelect = ({ target: { name, files } }) => {
    setState({ [name]: files[0].path });
  }

  const handleClose = () => {
    // check if download path exists
    goToPath('/');
  }

  return (
    <div className={styles.container}>
      <button type="button" className={styles.close} onClick={handleClose}>
        <i className="fa fa-times" />
      </button>
      <div className={styles.section}>
        <p className={styles.title}>
          Downloads
        </p>
        <div className={styles.inputWithButton}>
          <label className={styles.inputLabel} htmlFor="dlPathInput">
            Download Path
            <input
              name="downloadPath"
              type="text"
              id="dlPathInput"
              value={downloadPath}
              onChange={handleChange}
            />
          </label>
          <label className={styles.buttonLabel} htmlFor="dlbPathInput">
            Browse...
            <input
              name="downloadPath"
              type="file"
              webkitdirectory="true"
              id="dlbPathInput"
              onChange={handleDirectorySelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>
          Notifications
        </p>
        <div className={styles.switchContainer}>
          <p>
            Notify on file download
          </p>
          <label htmlFor="notifyDownload" className={styles.switch}>
            <input
              id="notifyDownload"
              name="notifyDownload"
              type="checkbox"
              checked={notifyDownload}
              onChange={handleChange}
            />
            <span className={styles.slider} />
          </label>
        </div>
        <div className={styles.switchContainer}>
          <p>
            Notify on file received
          </p>
          <label htmlFor="notifyReceived" className={styles.switch}>
            <input
              id="notifyReceived"
              name="notifyReceived"
              type="checkbox"
              checked={notifyReceived}
              onChange={handleChange}
            />
            <span className={styles.slider} />
          </label>
        </div>
        <div className={`${styles.switchContainer} ${styles.last}`}>
          <p>
            Notify on file upload
          </p>
          <label htmlFor="notifyUpload" className={styles.switch}>
            <input
              id="notifyUpload"
              name="notifyUpload"
              type="checkbox"
              checked={notifyUpload}
              onChange={handleChange}
            />
            <span className={styles.slider} />
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>
          Account
        </p>
        <div className={styles.staticField}>
          <i className="fa fa-envelope" />
          <p>
            {email}
          </p>
        </div>
        <label className={`${styles.inputLabel} ${styles.icon}`} htmlFor="usernameInput">
          <i className="fa fa-user" />
          <input
            name="username"
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleChange}
          />
        </label>
        <button type="button" className={styles.logout} onClick={() => { logout(); goToPath('/auth'); }}>
          <i className="fa fa-sign-out-alt" />Logout
        </button>
      </div>
    </div>
  );
};

Settings.propTypes = {
  downloadPath: string.isRequired,
  email: string.isRequired,
  notifyDownload: bool.isRequired,
  notifyReceived: bool.isRequired,
  notifyUpload: bool.isRequired,
  username: string.isRequired,
  setState: func.isRequired,
  goToPath: func.isRequired,
  logout: func.isRequired
};

export default Settings;
