import React, { Component } from 'react';
import { connect } from 'react-redux';
import { string } from 'prop-types';
import callApi from '../helpers/apiCaller';

import Friends from '../components/Friends';

const mapStateToProps = ({ user }) => ({
  userId: user.id
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
    return (
      <Friends
        friendTag={friendTag}
        handleChange={this.handleChange}
        openModal={this.openModal}
        sendRequest={this.sendRequest}
        requestMessage={requestMessage}
      />
    );
  }
}

FriendsPage.propTypes = {
  userId: string.isRequired
};

export default connect(
  mapStateToProps,
  null
)(FriendsPage);
