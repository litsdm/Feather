import React, { useState } from 'react';
import Lottie from 'react-lottie';
import styles from './Empty.scss';

import hiAnimation from '../../assets/hiAnimation.json';

const Empty = () => {
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
      <p className={styles.title}>Welcome to Feather!</p>
      <p className={styles.text}>
        It looks like you don&#39;t have any files. Drag and drop your files to
        share them.
      </p>
    </div>
  );
};

export default Empty;
