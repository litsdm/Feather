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
        You have no files yet. You will receive your files here or you can drag
        and drop a file anywhere to upload it.
      </p>
    </div>
  );
};

export default Empty;
