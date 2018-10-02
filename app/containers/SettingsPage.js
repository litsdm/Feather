import React, { Component } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';

import { emit } from '../socketClient';

import { logoutUser } from '../actions/user';

import Settings from '../components/Settings';

const mapStateToProps = ({ user: { email, username } }) => (
  {
    email,
    username
  }
);

const mapDispatchToProps = dispatch => ({
  logout: () => {
    emit('logout');
    localStorage.removeItem('tempoToken');
    dispatch(logoutUser());
  }
});

class SettingsPage extends Component {
  state = {
    downloadPath: '',
    notifyDownload: true,
    notifyUpload: true,
    notifyReceived: true,
    username: ''
  };

  componentWillMount() {
    this.loadState();
  }

  loadState = () => {
    const { username } = this.props;
    const localConfig = localStorage.getItem('localConfig');

    if (localConfig) {
      const parsedConfig = JSON.parse(localConfig);
      const downloadPath = parsedConfig.downloadPath || remote.app.getPath('downloads');

      this.setState({ ...parsedConfig, downloadPath, username });
    }
  }

  receiveStateFromChild = (newState) => this.setState({ ...newState });

  goToPath = (path) => {
    const { history } = this.props;
    const { username } = this.state;
    const oldConfig = JSON.parse(localStorage.getItem('localConfig'));
    const localConfig = JSON.stringify(this.state);

    if (oldConfig.username !== username) {
      // update username on backend
    }

    localStorage.setItem('localConfig', localConfig);

    history.push(path);
  }

  render() {
    const { downloadPath, notifyDownload, notifyUpload, notifyReceived, username } = this.state;
    const { email, logout } = this.props;
    return (
      <Settings
        downloadPath={downloadPath}
        email={email}
        notifyDownload={notifyDownload}
        notifyUpload={notifyUpload}
        notifyReceived={notifyReceived}
        username={username}
        setState={this.receiveStateFromChild}
        goToPath={this.goToPath}
        logout={logout}
      />
    );
  }
}

SettingsPage.propTypes = {
  email: string.isRequired,
  history: object.isRequired, // eslint-disable-line
  logout: func.isRequired,
  username: string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
