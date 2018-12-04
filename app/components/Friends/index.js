import React from 'react';
import { func, string, shape } from 'prop-types';
import styles from './styles.scss';
import rowStyles from './FriendRow.scss';

import FriendRow from './FriendRow';
import AddFriendModal from './AddFriendModal';

const Friends = ({
  friendTag,
  handleChange,
  openModal,
  requestMessage,
  sendRequest
}) => (
  <div className={styles.friends}>
    <div className={styles.searchWrapper}>
      <label htmlFor="searchInput" className={styles.searchLabel}>
        <i className="fa fa-search" />
        <input
          id="searchInput"
          name="search"
          type="text"
          placeholder="Search for friends"
        />
      </label>
    </div>
    <div className={styles.list}>
      <button type="button" className={rowStyles.row} onClick={openModal}>
        <div className={styles.addIcon}>
          <i className="fa fa-user-plus" />
        </div>
        <p className={styles.addText}>Add Friend</p>
      </button>
      <FriendRow
        _id="43534598792834"
        name="Juan Pablo"
        placeholderColor="#4CAF50"
      />
      <FriendRow
        _id="55897692023940"
        name="Kenny Lugo"
        placeholderColor="#03A9F4"
      />
    </div>
    <AddFriendModal
      friendTag={friendTag}
      handleChange={handleChange}
      sendRequest={sendRequest}
      requestMessage={requestMessage}
    />
  </div>
);

Friends.propTypes = {
  friendTag: string.isRequired,
  handleChange: func.isRequired,
  openModal: func.isRequired,
  sendRequest: func.isRequired,
  requestMessage: shape({
    text: string,
    type: string
  })
};

Friends.defaultProps = {
  requestMessage: null
};

export default Friends;
