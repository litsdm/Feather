import React from 'react';
import { number } from 'prop-types';
import styles from './CircleProgress.scss';

const CircularProgress = ({ sqSize, strokeWidth, percentage }) => {
  const radius = (sqSize - strokeWidth) / 2;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className={styles.circleBackground}
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className={styles.circleProgress}
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset
        }}
      />
    </svg>
  );
};

CircularProgress.propTypes = {
  sqSize: number,
  percentage: number,
  strokeWidth: number
};

CircularProgress.defaultProps = {
  sqSize: 200,
  percentage: 0,
  strokeWidth: 10
};

export default CircularProgress;
