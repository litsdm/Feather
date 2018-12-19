import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import styles from './DisconnectedModal.scss';

class DisconnectedModal extends Component {
  state = {
    timeLeft: 10,
    prevTime: 0
  };

  componentDidMount = () => {
    this.startTimer();
  };

  componentDidUpdate = prevProps => {
    const { isFetching } = this.props;
    const { isFetching: prevFetching } = prevProps;

    if (prevFetching && !isFetching) {
      this.startTimer();
    }
  };

  componentWilUnmount = () => {
    if (this.timer !== 0) clearInterval(this.timer);
  };

  timer = 0;

  startTimer = () => {
    const { prevTime } = this.state;
    const newTime = prevTime + 10;
    this.setState({ timeLeft: newTime, prevTime: newTime }, () => {
      this.timer = setInterval(this.countDown, 1000);
    });
  };

  countDown = () => {
    const { timeLeft } = this.state;
    const { retry } = this.props;
    const newTime = timeLeft - 1;

    this.setState({ timeLeft: newTime });

    if (newTime === 0) {
      retry();
      clearInterval(this.timer);
    }
  };

  handleRetryNow = () => {
    const { retry } = this.props;
    clearInterval(this.timer);
    retry();
  };

  render() {
    const { timeLeft } = this.state;
    const { isFetching } = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.overlay} />
        <div className={styles.modal}>
          <div className={styles.header}>
            <p>Unable to Connect</p>
          </div>
          <div className={styles.content}>
            <p className={styles.message}>
              Please double check your internet connection. If this issue
              persists please contact support.
            </p>
            <p className={styles.retrying}>
              {isFetching
                ? 'Retrying...'
                : `Retrying again in ${timeLeft} seconds`}
            </p>
            <button
              type="button"
              className={styles.retry}
              onClick={this.handleRetryNow}
            >
              Retry Now
            </button>
          </div>
        </div>
      </div>
    );
  }
}

DisconnectedModal.propTypes = {
  retry: func.isRequired,
  isFetching: bool.isRequired
};

export default DisconnectedModal;
