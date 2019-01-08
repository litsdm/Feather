import React from 'react';
import { shell } from 'electron';
import { func, string, number } from 'prop-types';
import styles from './UpgradeModal.scss';

import { humanFileSize } from '../helpers/file';

const UpgradeModal = ({ close, type, remainingBytes }) => {
  const renderMessage = () =>
    type === 'fileSize' ? (
      <p className={styles.message}>
        Your file size exceeds the maximum file size limit for your account (2
        GB). We have a solution for you, with <b>Feather Plus</b> you can raise
        the limit up to 10 GB per file.
      </p>
    ) : (
      <p className={styles.message}>
        You don
        {"'"}t have enough storage left on your account (
        {humanFileSize(remainingBytes)}
        ). Get <b>Feather Plus</b> to upgrade your limit to 50 GB per week.
      </p>
    );

  return (
    <div id="upgradeModal" className={styles.wrapper}>
      <button className={styles.overlay} type="button" onClick={close} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <p>
            {type === 'fileSize'
              ? 'File size exceeds limit'
              : 'Not enough storage space'}
          </p>
          <button type="button" className={styles.close} onClick={close}>
            <i className="fa fa-times" />
          </button>
        </div>
        <div className={styles.content}>
          {renderMessage()}
          <button
            type="button"
            className={styles.button}
            onClick={() =>
              shell.openExternal('https://feather-client.herokuapp.com/upgrade')
            }
          >
            Get Feather Plus
          </button>
        </div>
      </div>
    </div>
  );
};

UpgradeModal.propTypes = {
  close: func.isRequired,
  type: string,
  remainingBytes: number.isRequired
};

UpgradeModal.defaultProps = {
  type: 'fileSize'
};

export default UpgradeModal;
