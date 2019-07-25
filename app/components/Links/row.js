import React, { useState } from 'react';
import { shell } from 'electron';
import { func, string } from 'prop-types';
import styles from './row.scss';

const Row = ({ id, date, expiry, copyText, select, deleteLink }) => {
  const [showMenu, setShowMenu] = useState(false);
  const url = `https://www.feathershare.com/${id}`;

  const handleCopy = () => {
    copyText(url);
    setShowMenu(false);
  };

  const handleOpen = () => shell.openExternal(url);

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <p className={styles.url}>{url}</p>
        <p className={styles.date}>
          {date} - Expires {expiry}
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.options}
          onFocus={() => setShowMenu(true)}
          onBlur={() => setShowMenu(false)}
        >
          <i className="fas fa-ellipsis-v" />
        </button>
        <div className={`${styles.menu} ${showMenu ? styles.display : ''}`}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleCopy}
          >
            Copy link
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleOpen}
          >
            Open link
          </button>
          <div className={styles.menuDivider} />
          <button type="button" className={styles.menuButton} onClick={select}>
            Show files
          </button>
          <div className={styles.menuDivider} />
          <button type="button" className={styles.delete} onClick={deleteLink}>
            Delete link
          </button>
        </div>
      </div>
    </div>
  );
};

Row.propTypes = {
  id: string.isRequired,
  date: string.isRequired,
  expiry: string.isRequired,
  copyText: func.isRequired,
  select: func.isRequired
};

export default Row;
