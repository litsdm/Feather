import React, { useState } from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import { userShape } from '../../shapes';
import styles from './styles.scss';

import Friends from './FriendsTab';

const SendModal = ({ stopWaiting, friends, userID, display, uploadFiles }) => {
  const [selectedFriends, setSelectedFriends] = useState({});
  const [tab, setActiveTab] = useState(0);

  const resetState = () => {
    setSelectedFriends({});
  };

  const handleBack = () => {
    stopWaiting();
    resetState();
  };

  const handleSend = () => {
    const finalEmails = [];
    const to = tab === 0 ? Object.keys(selectedFriends) : finalEmails;
    const addToUser = selectedFriends[userID] === 1;

    const send = {
      to,
      from: userID
    };

    if (tab === 0) uploadFiles(send, addToUser);

    resetState();
  };

  const handleSelect = id => () => {
    const containsID = Object.prototype.hasOwnProperty.call(
      selectedFriends,
      id
    );

    let newSelectedFriends;

    if (containsID) {
      newSelectedFriends = { ...selectedFriends };
      delete newSelectedFriends[id];
    } else {
      newSelectedFriends = { ...selectedFriends, [id]: 1 };
    }

    setSelectedFriends(newSelectedFriends);
  };

  const renderTabs = () => {
    switch (tab) {
      case 0:
        return (
          <Friends
            friends={friends}
            selectedFriends={selectedFriends}
            select={handleSelect}
            userID={userID}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ zIndex: display ? 15 : -1 }}>
      <div className={styles.overlay} style={{ opacity: display ? 1 : 0 }} />
      <div className={styles.sendModal} style={{ bottom: display ? 0 : -560 }}>
        <div className={styles.top}>
          <button type="button" className={styles.close} onClick={handleBack}>
            <i className="fa fa-times" />
          </button>
          <p>Send To</p>
          <button type="button" className={styles.send} onClick={handleSend}>
            <i className="far fa-paper-plane" />
          </button>
        </div>
        <div className={styles.tabSelect}>
          <button
            type="button"
            className={tab === 0 ? styles.tabActive : {}}
            onClick={() => setActiveTab(0)}
          >
            Friends
            {Object.keys(selectedFriends).length > 0 && tab === 0 ? (
              <div className={styles.badge}>
                {Object.keys(selectedFriends).length}
              </div>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === 1 ? styles.tabActive : {}}
            onClick={() => setActiveTab(1)}
          >
            Email
          </button>
        </div>
        {renderTabs()}
      </div>
    </div>
  );
};

SendModal.propTypes = {
  friends: arrayOf(userShape),
  stopWaiting: func.isRequired,
  userID: string.isRequired,
  display: bool.isRequired,
  uploadFiles: func.isRequired
};

SendModal.defaultProps = {
  friends: []
};

export default SendModal;
