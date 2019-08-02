import React from 'react';
import Lottie from 'react-lottie';
import { bool } from 'prop-types';
import styles from './DropOverlay.scss';

import * as shareAnimation from '../assets/shareAnimation.json';

const DropOverlay = ({ visible }) => (
  <div
    className={styles.overlay}
    style={visible ? { display: 'flex' } : { display: 'none' }}
  >
    <p>Drop your File to Send it</p>
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: shareAnimation.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }}
      height={150}
      isPaused={!visible}
    />
  </div>
);

DropOverlay.propTypes = {
  visible: bool.isRequired
};

export default DropOverlay;
