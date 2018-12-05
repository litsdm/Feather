import React, { Component } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { func, object, string } from 'prop-types';
import { userShape } from '../shapes';

import { emit } from '../socketClient';
import { logoutUser, addUser } from '../actions/user';
import callApi from '../helpers/apiCaller';

import Settings from '../components/Settings';

const mapStateToProps = ({ user }) => ({
  user,
  userId: user.id
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
    const {
      user: { username }
    } = this.props;
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
    const {
      user: { username: unused, ...rest },
      logout
    } = this.props;
    return (
      <Settings
        downloadPath={downloadPath}
        notifyDownload={notifyDownload}
        notifyUpload={notifyUpload}
        notifyReceived={notifyReceived}
        setState={this.receiveStateFromChild}
        goToPath={this.goToPath}
        logout={logout}
        username={username}
        {...rest}
      />
    );
  }
}

SettingsPage.propTypes = {
  history: object.isRequired, // eslint-disable-line
  logout: func.isRequired,
  userId: string.isRequired,
  user: userShape.isRequired,
  replaceUserFromToken: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage);
