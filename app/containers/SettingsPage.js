import React, { Component } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';
import jwtDecode from 'jwt-decode';

import { emit } from '../socketClient';
import { logoutUser, addUser } from '../actions/user';
import callApi from '../helpers/apiCaller';

import Settings from '../components/Settings';

const mapStateToProps = ({ user: { id, email, username } }) => ({
  email,
  username,
  userId: id
});

const mapDispatchToProps = dispatch => ({
  logout: () => {
    emit('logout');
    localStorage.removeItem('tempoToken');
    dispatch(logoutUser());
  },
  replaceUserFromToken: token => dispatch(addUser(jwtDecode(token)))
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
      const downloadPath =
        parsedConfig.downloadPath || remote.app.getPath('downloads');
      const newState = { ...parsedConfig, downloadPath, username };

      this.setState(newState);
      localStorage.setItem('localConfig', JSON.stringify(newState));
    }
  };

  receiveStateFromChild = newState => this.setState({ ...newState });

  goToPath = path => {
    const { history, userId, replaceUserFromToken } = this.props;
    const { username } = this.state;
    const oldConfig = JSON.parse(localStorage.getItem('localConfig'));
    const localConfig = JSON.stringify(this.state);

    if (oldConfig.username !== username) {
      callApi(`${userId}/update`, { name: 'username', value: username }, 'PUT')
        .then(res => res.json())
        .then(({ token, err }) => {
          if (err) return Promise.reject(err);
          localStorage.setItem('tempoToken', token);
          return replaceUserFromToken(token);
        })
        .catch(err => console.log(err));
    }

    localStorage.setItem('localConfig', localConfig);

    history.push(path);
  };

  render() {
    const {
      downloadPath,
      notifyDownload,
      notifyUpload,
      notifyReceived,
      username
    } = this.state;
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
  username: string.isRequired,
  userId: string.isRequired,
  replaceUserFromToken: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage);
