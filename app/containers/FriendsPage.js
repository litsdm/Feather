import React, { useState } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func } from 'prop-types';
import { userShape, friendRequestShape } from '../shapes';

import callApi from '../helpers/apiCaller';
// import analytics from '../helpers/analytics';
import { emit } from '../socketClient';
import { addFriend } from '../actions/friend';
import { removeFriendRequest } from '../actions/friendRequest';

import Friends from '../components/Friends';
import Loader from '../components/Loader';

const mapStateToProps = ({
  user,
  friend: { friends, isFetching },
  friendRequest
}) => ({
  user,
  friends,
  isFriendFetching: isFetching,
  friendRequests: friendRequest.friendRequests,
  isFriendRequestFetching: friendRequest.isFetching
});

const mapDispatchToProps = dispatch => ({
  removeRequest: index => dispatch(removeFriendRequest(index)),
  addAcceptedFriend: friend => dispatch(addFriend(friend))
});

const FriendsPage = ({
  user,
  friends,
  isFriendFetching,
  friendRequests,
  isFriendRequestFetching,
  removeRequest,
  addAcceptedFriend
}) => {
  const [friendTag, setFriendTag] = useState('');
  const [requestMessage, setRequestMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);

  const handleSearchChange = ({ target: { value } }) => {
    setSearchTerm(value);
    filterFriends();
  };

  const filterFriends = () => {
    const filtered =
      searchTerm !== ''
        ? friends.filter(friend =>
            friend.username.toLowerCase().startsWith(searchTerm.toLowerCase())
          )
        : [];

    setFilteredFriends(filtered);
  };

  const openModal = () => {
    const element = document.getElementById('addFriendModal');
    if (!element) return;
    element.style.display = 'flex';
  };

  const deleteRequest = url =>
    new Promise(async (resolve, reject) => {
      const { status } = await callApi(url, {}, 'DELETE');
      if (status !== 200)
        reject(
          new Error(
            'Looks like something went wrong. Please double check your internet connection.'
          )
        );

      resolve();
    });

  const resolveRequest = (_id, index, type) => async () => {
    try {
      const { from: friend } = friendRequests[index];
      await deleteRequest(`friendRequest/${_id}/${type}`);

      if (type === 'accept') {
        const sendFriend = {
          _id: user.id,
          username: user.username,
          placeholderColor: user.placeholderColor
        };
        addAcceptedFriend(friend);
        emit('acceptRequest', { roomId: friend._id, friend: sendFriend });
      }
      removeRequest(index);
    } catch (exception) {
      console.error(`[FriendsPage.resolveRequest] ${exception.message}`);
    }
  };

  const displayBadge = (text, type) => {
    setRequestMessage({ text, type });
    setTimeout(() => setRequestMessage(null), 1800);
  };

  const postRequest = payload =>
    new Promise(async (resolve, reject) => {
      const response = await callApi('friendRequest', payload, 'POST');
      const { friendRequest, message } = await response.json();
      if (message) reject(new Error(message));
      resolve(friendRequest);
    });

  const sendRequest = async () => {
    const queryProperty =
      friendTag.split('#').length < 2 && friendTag.includes('@')
        ? 'email'
        : 'tag';
    try {
      const payload = { tag: friendTag, from: user.id, queryProperty };
      const friendRequest = await postRequest(payload);

      const formatRequest = {
        ...friendRequest,
        from: {
          _id: user.id,
          username: user.username,
          placeholderColor: user.placeholderColor
        }
      };

      emit('sendRequest', {
        roomId: friendRequest.to,
        friendRequest: formatRequest
      });

      displayBadge('Your request is on the way!', 'success');
    } catch (exception) {
      displayBadge("We couldn't find your friend.", 'error');
      if (queryProperty === 'email')
        callApi('email/newFriend', { to: [friendTag] }, 'POST');
      console.error(`[FriendsPage.sendRequest] ${exception.message}`);
    }
  };

  return isFriendFetching || isFriendRequestFetching ? (
    <Loader />
  ) : (
    <Friends
      friendTag={friendTag}
      setFriendTag={setFriendTag}
      handleSearchChange={handleSearchChange}
      openModal={openModal}
      sendRequest={sendRequest}
      requestMessage={requestMessage}
      friends={friends}
      friendRequests={friendRequests}
      resolveRequest={resolveRequest}
      searchTerm={searchTerm}
      filteredFriends={filteredFriends}
    />
  );
};

FriendsPage.propTypes = {
  user: userShape,
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape),
  isFriendFetching: bool.isRequired,
  isFriendRequestFetching: bool.isRequired,
  removeRequest: func.isRequired,
  addAcceptedFriend: func.isRequired
};

FriendsPage.defaultProps = {
  user: {},
  friends: [],
  friendRequests: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendsPage);
