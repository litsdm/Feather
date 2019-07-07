import React, { useEffect, useState } from 'react';
import { bool, func } from 'prop-types';
import styles from './DisconnectedModal.scss';

function useCountdown(retry) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [prevTime, setPrevTime] = useState(10);
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 0) {
          const newTime = prevTime === 60 ? 60 : prevTime + 10;
          clearInterval(interval);
          retry();
          setPrevTime(newTime);
          return newTime;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return timeLeft;
}

const DisconnectedModal = ({ isFetching, retry }) => {
  const timeLeft = useCountdown(retry);

  return (
    <div className={styles.disconnectModal}>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <p className={styles.title}>Unable to Connect</p>
        <p className={styles.subtitle}>
          Please double check your internet connection. If this issue persists
          please contact support.
        </p>
        <p className={styles.status}>
          {isFetching ? 'Retrying...' : `Retrying again in ${timeLeft} seconds`}
        </p>
        <button type="button" className={styles.retry} onClick={retry}>
          Retry Now
        </button>
      </div>
    </div>
  );
};

DisconnectedModal.propTypes = {
  retry: func.isRequired,
  isFetching: bool.isRequired
};

export default DisconnectedModal;
