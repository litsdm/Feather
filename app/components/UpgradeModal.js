import React from 'react';
import { shell } from 'electron';
import Lottie from 'react-lottie';
import { func, string } from 'prop-types';
import styles from './UpgradeModal.scss';

import analytics from '../helpers/analytics';
import crownAnimation from '../assets/crownAnimation.json';

const UpgradeModal = ({ close, type }) => {
  const openLink = () => {
    analytics.send('event', {
      ec: 'Upgrade-El',
      ea: 'gotoPage',
      el: 'Open upgrade page'
    });
    shell.openExternal('https://feather-client.herokuapp.com/upgrade');
  };

  const getInitialText = () => {
    switch (type) {
      case 'fileSize':
        return 'Your file exceeds the free file limit of 2GB.';
      case 'remainingFiles':
        return 'You have reached the free file amount limit of 3 files a day.';
      case 'remainingBytes':
        return 'You have reached your free Feather storage space limit.';
      default:
        return '';
    }
  };

  return (
    <div id="upgradeModal" className={styles.upgradeModal}>
      <button type="button" className={styles.overlay} onClick={close} />
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={close}>
          <i className="fa fa-times" />
        </button>
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: crownAnimation,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }}
          height={100}
        />
        <p className={styles.title}>Upgrade to Pro</p>
        <p className={styles.description}>
          {getInitialText()} Feather is maintained by a single developer and as
          much as I would like to give this service for free, it needs a way to
          keep itself afloat. Please consider upgrading to our Pro subscription,
          you can choose what to pay for it!
        </p>
        <button type="button" className={styles.open} onClick={openLink}>
          Take me to the Upgrade page
        </button>
      </div>
    </div>
  );
};

UpgradeModal.propTypes = {
  close: func.isRequired,
  type: string
};

UpgradeModal.defaultProps = {
  type: ''
};

export default UpgradeModal;
