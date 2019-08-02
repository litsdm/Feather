import React, { useState } from 'react';
import Lottie from 'react-lottie';
import { bool, string } from 'prop-types';
import styles from './LinkModal.scss';

import mailAnimation from '../assets/mailAnimation.json';

const LinkModal = ({ url, onlyLink }) => {
  const [didCopy, setCopy] = useState(false);

  const closeModal = () => {
    document.getElementById('linkModal').style.display = 'none';
  };

  const copyText = ({ target }) => {
    target.select();
    document.execCommand('copy');

    setCopy(true);
    setTimeout(() => setCopy(false), 1500);
  };

  return (
    <div id="linkModal" className={styles.linkModal}>
      <button type="button" className={styles.overlay} onClick={closeModal} />
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={closeModal}>
          <i className="fa fa-times" />
        </button>
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: mailAnimation,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }}
          height={100}
        />
        <p className={styles.title}>
          {onlyLink
            ? 'Your link has been created!'
            : 'Your email has been sent!'}
        </p>
        <p className={styles.subtitle}>
          You can copy and share this link with anyone.
        </p>
        <input
          className={styles.input}
          value={url}
          onClick={copyText}
          readOnly
        />
      </div>
      <div
        className={`${styles.badgeNotification} ${
          didCopy ? styles.display : ''
        }`}
      >
        <p>Copied to clipboard</p>
      </div>
    </div>
  );
};

LinkModal.propTypes = {
  url: string,
  onlyLink: bool
};

LinkModal.defaultProps = {
  url: '',
  onlyLink: false
};

export default LinkModal;
