import React, { useState } from 'react';
import { shell } from 'electron';
import moment from 'moment';
import { func, string } from 'prop-types';
import styles from './row.scss';

const Row = ({ id, date, expiresAt, copyText, select, deleteLink }) => {
  const [showMenu, setShowMenu] = useState(false);
  const url = `https://www.feathershare.com/${id}`;
  const expiry = moment().to(expiresAt);
  const isExpired = moment().diff(expiresAt) > 0;

  const handleCopy = () => {
    copyText(url);
    setShowMenu(false);
  };

  const handleOpen = () => shell.openExternal(url);

  const withExpired = style => `${style} ${isExpired ? styles.expired : ''}`;

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <p className={withExpired(styles.url)}>{url}</p>
        <p className={styles.date}>
          {date} - {isExpired ? 'Expired' : `Expires ${expiry}`}
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
  expiresAt: string.isRequired,
  copyText: func.isRequired,
  select: func.isRequired,
  deleteLink: func.isRequired
};

export default Row;
