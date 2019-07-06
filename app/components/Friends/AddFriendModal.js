import React from 'react';
import Lottie from 'react-lottie';
import { func, string, shape } from 'prop-types';
import styles from './AddFriendModal.scss';

import celebrationAnimation from '../../assets/celebrationAnimation.json';

const AddFriendModal = ({
  friendTag,
  setFriendTag,
  requestMessage,
  sendRequest
}) => {
  const closeModal = () => {
    document.getElementById('addFriendModal').style.display = 'none';
  };

  const formatHint = () => {
    const additional = '#0000';
    const parts = friendTag.split('#');
    let sliceIndex = 0;

    if (friendTag.includes('@')) {
      return friendTag;
    }

    if (parts.length === 2) {
      sliceIndex = parts[1].length + 1;
    }

    return `${friendTag}${additional.slice(sliceIndex)}`;
  };

  const badgeClass = () => {
    if (!requestMessage) return styles.errBadge;

    return `${
      requestMessage.type === 'success' ? styles.successBadge : styles.errBadge
    } ${styles.display}`;
  };

  return (
    <div id="addFriendModal" className={styles.friendModal}>
      <button type="button" className={styles.overlay} onClick={closeModal} />
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={closeModal}>
          <i className="fa fa-times" />
        </button>
        <p className={styles.title}>Add a Friend</p>
        <label htmlFor="addFriendInput" className={styles.label}>
          <input
            id="addFriendInput"
            type="text"
            name="friendTag"
            value={friendTag}
            placeholder="username#0000 or email"
            onChange={({ target: { value } }) => setFriendTag(value)}
          />
          <div className={styles.hint}>{friendTag ? formatHint() : null}</div>
        </label>
        <button type="button" className={styles.send} onClick={sendRequest}>
          Send Friend Request
        </button>
      </div>
      <div className={badgeClass()}>
        <p>{requestMessage ? requestMessage.text : ''}</p>
      </div>
      <div className={styles.animation}>
        <Lottie
          options={{
            loop: false,
            autoplay: false,
            animationData: celebrationAnimation,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid meet'
            }
          }}
          height={285}
          isStopped={!(requestMessage && requestMessage.type === 'success')}
        />
      </div>
    </div>
  );
};

AddFriendModal.propTypes = {
  friendTag: string.isRequired,
  setFriendTag: func.isRequired,
  sendRequest: func.isRequired,
  requestMessage: shape({
    text: string,
    type: string
  })
};

AddFriendModal.defaultProps = {
  requestMessage: null
};

export default AddFriendModal;
