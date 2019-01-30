import React, { Component } from 'react';
import { arrayOf, bool, func } from 'prop-types';
import { userShape } from '../../shapes';
import styles from './styles.scss';

import { validateEmail } from '../../helpers/string';

import FriendsTab from './FriendsTab';
import EmailTab from './EmailTab';

class SendPopUp extends Component {
  state = {
    receivers: [],
    selectedIndeces: {},
    emails: [],
    currentEmail: '',
    emailError: '',
    tab: 0
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

  handleKeyPress = ({ key }) => {
    if (key === 'Enter' || key === ' ') {
      const { emails, currentEmail } = this.state;
      if (!validateEmail(currentEmail)) {
        this.setState({ emailError: 'Invalid email' });
        return;
      }
      this.setState({ emails: [...emails, currentEmail], currentEmail: '' });
    }
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value.trim(), emailError: '' });

  handleRemoveEmail = index => {
    const { emails } = this.state;
    this.setState({
      emails: [...emails.slice(0, index), ...emails.slice(index + 1)]
    });
  };

  renderTabs = () => {
    const {
      receivers,
      selectedIndeces,
      tab,
      currentEmail,
      emails,
      emailError
    } = this.state;
    const { friends } = this.props;

    if (tab === 0)
      return (
        <FriendsTab
          friends={friends}
          receivers={receivers}
          selectedIndeces={selectedIndeces}
          handleAdd={this.handleAdd}
          handleRemove={this.handleRemove}
        />
      );

    if (tab === 1)
      return (
        <EmailTab
          currentEmail={currentEmail}
          emails={emails}
          handleKeyPress={this.handleKeyPress}
          handleChange={this.handleChange}
          removeEmail={this.handleRemoveEmail}
          error={emailError}
        />
      );
  };

  render() {
    const { receivers, tab, emails } = this.state;
    const { display } = this.props;
    const sendActive =
      (tab === 0 && receivers.length > 0) || (tab === 1 && emails.length > 0);

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
        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === 0 ? styles.tabActive : {}}
            onClick={() => this.setState({ tab: 0 })}
          >
            Friends
          </button>
          <button
            type="button"
            className={tab === 1 ? styles.tabActive : {}}
            onClick={() => this.setState({ tab: 1 })}
          >
            Email
          </button>
        </div>
        {this.renderTabs()}
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
