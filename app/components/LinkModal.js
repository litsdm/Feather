import React from 'react';
import { string } from 'prop-types';
import styles from './LinkModal.scss';

const LinkModal = ({ url }) => {
  const closeModal = () => {
    document.getElementById('linkModal').style.display = 'none';
  };

  const copyText = ({ target }) => {
    target.select();
    document.execCommand('copy');
  };

  return (
    <div id="linkModal" className={styles.wrapper}>
      <button className={styles.overlay} type="button" onClick={closeModal} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <p>Share your Link</p>
          <button type="button" className={styles.close} onClick={closeModal}>
            <i className="fa fa-times" />
          </button>
        </div>
        <div className={styles.content}>
          <input
            className={styles.input}
            value={url}
            onClick={copyText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

LinkModal.propTypes = {
  url: string
};

LinkModal.defaultProps = {
  url: ''
};

export default LinkModal;
