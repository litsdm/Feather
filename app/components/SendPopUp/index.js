import React, { Component } from 'react';
import uuid from 'uuid/v4';
import { arrayOf, bool, func } from 'prop-types';
import { userShape } from '../../shapes';
import styles from './styles.scss';

import Row from './Row';
import ProfilePic from '../ProfilePic';

class SendPopUp extends Component {
  state = {
    receivers: [],
    selectedIndeces: {}
  };

  findFriendIndex = friendId => {
    const { receivers } = this.state;
    for (let i = 0; i < receivers.length / 2; i += 1) {
      const j = receivers.length - 1 - i;
      const firstElement = receivers[i];
      const lastElement = receivers[j];

      if (firstElement._id === friendId) return i;
      if (lastElement._id === friendId) return j;
    }
  };

  handleSend = () => {
    const { receivers, selectedIndeces } = this.state;
    const {
      user: { id },
      uploadFiles
    } = this.props;

    const to = receivers.map(({ _id }) => _id);

    const send = {
      to,
      from: id
    };

    uploadFiles(send, selectedIndeces[0]);

    this.setState({ receivers: [], selectedIndeces: {} });
  };

  handleBack = () => {
    const { stopWaiting } = this.props;
    stopWaiting();
    this.setState({ receivers: [], selectedIndeces: {} });
  };

  handleAdd = index => () => {
    const { receivers, selectedIndeces } = this.state;
    const { friends } = this.props;
    const friend = friends[index];

    this.setState({
      receivers: [...receivers, friend],
      selectedIndeces: { ...selectedIndeces, [index]: true }
    });
  };

  handleRemove = index => () => {
    const { receivers, selectedIndeces } = this.state;
    const { friends } = this.props;
    const removeIndex = this.findFriendIndex(friends[index]._id);

    this.setState({
      receivers: [
        ...receivers.slice(0, removeIndex),
        ...receivers.slice(removeIndex + 1)
      ],
      selectedIndeces: { ...selectedIndeces, [index]: null }
    });
  };

  renderSelectedFriends = () => {
    const { receivers } = this.state;

    const picStyle = {
      border: '1px solid #fff',
      height: '18px',
      marginLeft: '-3px',
      marginRight: 0,
      width: '18px'
    };

    return receivers.map(friend => (
      <ProfilePic
        key={uuid()}
        {...friend}
        picStyle={picStyle}
        phStyle={{ fontSize: '9px' }}
      />
    ));
  };

  renderFriends = () => {
    const { selectedIndeces } = this.state;
    const { friends } = this.props;

    return friends.map((friend, index) => (
      <Row
        key={uuid()}
        isSelected={selectedIndeces[index] || false}
        addFriend={this.handleAdd}
        removeFriend={this.handleRemove}
        index={index}
        {...friend}
      />
    ));
  };

  render() {
    const { receivers } = this.state;
    const { display } = this.props;
    const sendActive = receivers.length > 0;

    return (
      <div className={`${styles.popUp} ${display ? styles.active : ''}`}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.back}
            onClick={this.handleBack}
          >
            <i className="fa fa-arrow-left" />
          </button>
          <p className={styles.title}>Send To</p>
          <button
            type="button"
            className={`${styles.send} ${sendActive ? styles.active : ''}`}
            disabled={!sendActive}
            onClick={this.handleSend}
          >
            <i className="far fa-paper-plane" />
          </button>
        </div>
        {receivers.length > 0 ? (
          <div className={styles.selectedFriends}>
            {this.renderSelectedFriends()}
          </div>
        ) : null}
        <div className={styles.list}>{this.renderFriends()}</div>
      </div>
    );
  }
}

SendPopUp.propTypes = {
  display: bool,
  stopWaiting: func.isRequired,
  friends: arrayOf(userShape).isRequired,
  uploadFiles: func.isRequired,
  user: userShape
};

SendPopUp.defaultProps = {
  display: false,
  user: {}
};

export default SendPopUp;
