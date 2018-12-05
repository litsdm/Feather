import React, { Fragment } from 'react';
import uuid from 'uuid/v4';
import { arrayOf, func, string, shape } from 'prop-types';
import { userShape, friendRequestShape } from '../../shapes';
import styles from './styles.scss';
import rowStyles from './FriendRow.scss';

import FriendRow from './FriendRow';
import AddFriendModal from './AddFriendModal';

const Friends = ({
  friendTag,
  handleChange,
  openModal,
  requestMessage,
  sendRequest,
  friends,
  resolveRequest,
  friendRequests
}) => {
  const renderFriendRequests = () =>
    friendRequests.map(({ from, _id }, index) => (
      <FriendRow
        key={uuid()}
        resolveRequest={resolveRequest}
        index={index}
        isRequest
        reqId={_id}
        {...from}
      />
    ));

  const renderFriends = () =>
    friends.map(({ _id, username, placeholderColor }) => (
      <FriendRow
        key={uuid()}
        _id={_id}
        username={username}
        placeholderColor={placeholderColor}
      />
    ));

  return (
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
        {friendRequests.length > 0 ? (
          <Fragment>
            <p className={styles.title}>Friend Requests</p>
            {renderFriendRequests()}
          </Fragment>
        ) : null}
        <p className={styles.title}>Your Friends</p>
        <button type="button" className={rowStyles.row} onClick={openModal}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.addIcon}>
              <i className="fa fa-user-plus" />
            </div>
            <p className={styles.addText}>Add Friend</p>
          </span>
        </button>
        {renderFriends()}
      </div>
      <AddFriendModal
        friendTag={friendTag}
        handleChange={handleChange}
        sendRequest={sendRequest}
        requestMessage={requestMessage}
      />
    </div>
  );
};

Friends.propTypes = {
  friendTag: string.isRequired,
  handleChange: func.isRequired,
  openModal: func.isRequired,
  sendRequest: func.isRequired,
  resolveRequest: func.isRequired,
  requestMessage: shape({
    text: string,
    type: string
  }),
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape)
};

Friends.defaultProps = {
  requestMessage: null,
  friends: [],
  friendRequests: []
};

export default Friends;
