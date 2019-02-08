import React from 'react';
import { func, number, string, shape } from 'prop-types';
import styles from './Banner.scss';

let runTimeout = false;

const Banner = ({ time, setHide, message }) => {
  const typeStyles = {
    error: {
      color: '#F44336',
      icon: 'fa fa-exclamation-circle'
    },
    success: {
      color: '#4CAF50',
      icon: 'fa fa-check-circle'
    },
    warning: {
      color: '#FFC107',
      icon: 'fa fa-exclamation-triangle'
    },
    info: {
      color: '#03A9F4',
      icon: 'fa fa-info-circle'
    }
  };

  const hideOnTimeout = () => {
    setTimeout(() => {
      setHide();
      runTimeout = false;
    }, time);
  };

  if (message && !runTimeout) {
    runTimeout = true;
    hideOnTimeout();
  }

  return message ? (
    <div
      className={styles.container}
      style={{ backgroundColor: typeStyles[message.type].color }}
    >
      <i className={typeStyles[message.type].icon} />
      <p className={styles.message}>{message ? message.text : ''}</p>
    </div>
  ) : null;
};

Banner.propTypes = {
  message: shape({
    type: string,
    text: string
  }),
  time: number,
  setHide: func.isRequired
};

Banner.defaultProps = {
  message: null,
  time: 2000
};

export default Banner;
