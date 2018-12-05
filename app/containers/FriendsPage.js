import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, string } from 'prop-types';
import { userShape } from '../shapes';

import callApi from '../helpers/apiCaller';

import Friends from '../components/Friends';

const mapStateToProps = ({ user: { id }, friend: { friends } }) => ({
  userId: id,
  friends
});

class FriendsPage extends Component {
  state = {
    friendTag: '',
    requestMessage: null
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  openModal = () => {
    const element = document.getElementById('addFriendModal');
    if (!element) return;
    element.style.display = 'flex';
  };

  sendRequest = () => {
    const { friendTag } = this.state;
    const { userId } = this.props;

    this.setState({ requestMessage: null });

    callApi('friendRequest', { tag: friendTag, from: userId }, 'POST')
      .then(res => res.json())
      .then(({ message }) => {
        if (message) return Promise.reject(message);
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
    const { friends } = this.props;
    return (
      <Friends
        friendTag={friendTag}
        handleChange={this.handleChange}
        openModal={this.openModal}
        sendRequest={this.sendRequest}
        requestMessage={requestMessage}
        friends={friends}
      />
    );
  }
}

FriendsPage.propTypes = {
  userId: string,
  friends: arrayOf(userShape)
};

FriendsPage.defaultProps = {
  userId: '',
  friends: []
};

export default connect(
  mapStateToProps,
  null
)(FriendsPage);
