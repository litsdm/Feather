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
  setFriendTag,
  handleSearchChange,
  openModal,
  requestMessage,
  sendRequest,
  friends,
  resolveRequest,
  friendRequests,
  searchTerm,
  filteredFriends
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

  const renderFriends = () => {
    const friendsToRender =
      filteredFriends.length > 0 ? filteredFriends : friends;

    return friendsToRender.map(({ username, profilePic, placeholderColor }) => (
      <FriendRow
        key={uuid()}
        profilePic={profilePic}
        username={username}
        placeholderColor={placeholderColor}
      />
    ));
  };

  return (
    <div className={styles.friends}>
      <div className={styles.searchWrapper}>
        <label htmlFor="searchInput" className={styles.searchLabel}>
          <i className="fa fa-search" />
          <input
            id="searchInput"
            name="searchTerm"
            value={searchTerm}
            type="text"
            placeholder="Search for friends"
            onChange={handleSearchChange}
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
        <button
          type="button"
          className={rowStyles.row}
          onClick={openModal}
          style={{ cursor: 'pointer' }}
        >
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
        setFriendTag={setFriendTag}
        sendRequest={sendRequest}
        requestMessage={requestMessage}
      />
    </div>
  );
};

Friends.propTypes = {
  friendTag: string.isRequired,
  setFriendTag: func.isRequired,
  handleSearchChange: func.isRequired,
  openModal: func.isRequired,
  sendRequest: func.isRequired,
  resolveRequest: func.isRequired,
  requestMessage: shape({
    text: string,
    type: string
  }),
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape),
  searchTerm: string,
  filteredFriends: arrayOf(userShape)
};

Friends.defaultProps = {
  searchTerm: '',
  requestMessage: null,
  friends: [],
  friendRequests: [],
  filteredFriends: []
};

export default Friends;
