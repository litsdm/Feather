import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func } from 'prop-types';
import { userShape, friendRequestShape } from '../shapes';

import callApi from '../helpers/apiCaller';
import { emit } from '../socketClient';
import { addFriend } from '../actions/friend';
import { removeFriendRequest } from '../actions/friendRequest';
import { uploadDirectly } from '../actions/upload';

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
  addAcceptedFriend: friend => dispatch(addFriend(friend)),
  uploadFiles: (files, send, addToUser = false) =>
    dispatch(uploadDirectly(files, send, addToUser))
});

class FriendsPage extends Component {
  state = {
    friendTag: '',
    requestMessage: null
  };

  sendFiles = (acceptedFiles, to) => {
    const { user, uploadFiles } = this.props;
    const send = {
      from: user.id,
      to
    };

    uploadFiles(acceptedFiles, send);
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  openModal = () => {
    const element = document.getElementById('addFriendModal');
    if (!element) return;
    element.style.display = 'flex';
  };

  resolveRequest = (_id, index, type) => () => {
    const {
      removeRequest,
      friendRequests,
      addAcceptedFriend,
      user
    } = this.props;
    const { from: friend } = friendRequests[index];
    callApi(`friendRequest/${_id}/${type}`, {}, 'DELETE')
      .then(({ status }) => {
        if (status !== 200)
          return Promise.reject(
            new Error(
              'Looks like something went wrong. Please double check your internet connection.'
            )
          );
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
        return Promise.resolve();
      })
      .catch(err => console.error(err));
  };

  sendRequest = () => {
    const { friendTag } = this.state;
    const { user } = this.props;

    this.setState({ requestMessage: null });

    callApi('friendRequest', { tag: friendTag, from: user.id }, 'POST')
      .then(res => res.json())
      .then(({ friendRequest, message }) => {
        if (message) return Promise.reject(message);

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

        this.setState({
          requestMessage: {
            text: 'Your friend request is on the way!',
            type: 'success'
          }
        });
        return Promise.resolve();
      })
      .catch(err =>
        this.setState({ requestMessage: { text: err, type: 'error' } })
      );
  };

  render() {
    const { friendTag, requestMessage } = this.state;
    const {
      friends,
      friendRequests,
      isFriendFetching,
      isFriendRequestFetching
    } = this.props;
    return isFriendFetching || isFriendRequestFetching ? (
      <Loader />
    ) : (
      <Friends
        friendTag={friendTag}
        handleChange={this.handleChange}
        openModal={this.openModal}
        sendRequest={this.sendRequest}
        requestMessage={requestMessage}
        friends={friends}
        friendRequests={friendRequests}
        resolveRequest={this.resolveRequest}
        sendFiles={this.sendFiles}
      />
    );
  }
}

FriendsPage.propTypes = {
  user: userShape,
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape),
  isFriendFetching: bool.isRequired,
  isFriendRequestFetching: bool.isRequired,
  removeRequest: func.isRequired,
  addAcceptedFriend: func.isRequired,
  uploadFiles: func.isRequired
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
