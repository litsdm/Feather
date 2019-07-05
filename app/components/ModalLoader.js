import React from 'react';
import Lottie from 'react-lottie';
import { bool } from 'prop-types';
import styles from './ModalLoader.scss';

import droppingLoader from '../assets/droppingLoader.json';

const ModalLoader = ({ display }) => (
  <div
    className={styles.modalContainer}
    style={{ display: display ? 'flex' : 'none' }}
  >
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: droppingLoader,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }}
      height={150}
      isPaused={!display}
    />
  </div>
);

ModalLoader.propTypes = {
  display: bool.isRequired
};

export default ModalLoader;
