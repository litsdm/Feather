import React from 'react';
import { func, string, shape } from 'prop-types';
import styles from './AddFriendModal.scss';

const AddFriendModal = ({
  friendTag,
  handleChange,
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

  return (
    <div className={styles.wrapper} id="addFriendModal">
      <div
        className={styles.overlay}
        onClick={closeModal}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      />
      <div className={styles.modal}>
        <div className={styles.header}>
          <p>Add a Friend</p>
          <button type="button" className={styles.close} onClick={closeModal}>
            <i className="fa fa-times" />
          </button>
        </div>
        <div className={styles.content}>
          {requestMessage ? (
            <p
              className={styles.message}
              style={{
                color: requestMessage.type === 'success' ? '#4CAF50' : '#F44336'
              }}
            >
              {requestMessage.text}
            </p>
          ) : null}
          <label htmlFor="addFriendInput" className={styles.label}>
            <input
              id="addFriendInput"
              type="text"
              name="friendTag"
              value={friendTag}
              placeholder="username#0000 or email"
              onChange={handleChange}
            />
            <div className={styles.hint}>{friendTag ? formatHint() : null}</div>
          </label>
          <button
            type="button"
            className={styles.addButton}
            onClick={sendRequest}
          >
            Send Friend Request
          </button>
        </div>
      </div>
    </div>
  );
};

AddFriendModal.propTypes = {
  friendTag: string.isRequired,
  handleChange: func.isRequired,
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
