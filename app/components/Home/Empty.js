import React, { useState } from 'react';
import Lottie from 'react-lottie';
import { bool } from 'prop-types';
import styles from './Empty.scss';

import hiAnimation from '../../assets/hiAnimation.json';

const Empty = ({ sent }) => {
  const [isPaused, setPaused] = useState(false);
  const options = {
    loop: true,
    autoplay: true,
    animationData: hiAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const animationOnComplete = () => {
    setPaused(true);
    setTimeout(() => setPaused(false), 4000);
  };

  const eventListeners = [
    {
      eventName: 'loopComplete',
      callback: animationOnComplete
    }
  ];

  return (
    <div className={styles.empty}>
      <div className={styles.animation}>
        <Lottie
          options={options}
          height={150}
          eventListeners={eventListeners}
          isPaused={isPaused}
        />
      </div>
      <p className={styles.title}>
        {!sent ? 'Welcome to Feather!' : 'No sent files'}
      </p>
      <p className={styles.text}>
        {!sent
          ? "It looks like you don't have any files"
          : "It looks like you haven't sent any files"}
        . Drag and drop your files to share them.
      </p>
    </div>
  );
};

Empty.propTypes = {
  sent: bool
};

Empty.defaultProps = {
  sent: false
};

export default Empty;
