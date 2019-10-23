import React, { useState } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import jwtDecode from 'jwt-decode';

import { emit } from '../socketClient';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

import { addUser } from '../actions/user';
import { fetchFilesIfNeeded } from '../actions/file';
import { fetchSentFilesIfNeeded } from '../actions/sentFile';
import { fetchFriendsIfNeeded } from '../actions/friend';
import { fetchFriendRequestsIfNeeded } from '../actions/friendRequest';
import { addLocalDownloads } from '../actions/download';

const mapDispatchToProps = dispatch => ({
  addUserFromToken: token => {
    const user = jwtDecode(token);
    emit('userConnection', user.id);
    dispatch(addUser(user));
  },
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
  fetchFriends: () => dispatch(fetchFriendsIfNeeded()),
  fetchFriendRequests: () => dispatch(fetchFriendRequestsIfNeeded()),
  fetchSentFiles: () => dispatch(fetchSentFilesIfNeeded()),
  addStorageFiles: () => dispatch(addLocalDownloads())
});

const AuthPage = ({
  fetchFiles,
  fetchSentFiles,
  fetchFriends,
  fetchFriendRequests,
  addUserFromToken,
  history,
  addStorageFiles
}) => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setNew] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);

  const setState = (property, value) => {
    switch (property) {
      case 'username':
        return setUsername(value);
      case 'email':
        return setEmail(value);
      case 'password':
        return setPassword(value);
      case 'isNew':
        return setNew(value);
      case 'authorizing':
        return setAuthorizing(value);
      default:
        break;
    }
  };

  const displayBadge = err => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  const fetchOnAuth = () => {
    fetchFiles()
      .then(() => addStorageFiles())
      .catch();
    fetchSentFiles();
    fetchFriends();
    fetchFriendRequests();
  };

  return isNew ? (
    <Signup
      username={username}
      email={email}
      password={password}
      setState={setState}
      displayBadge={displayBadge}
      addUser={addUserFromToken}
      fetchNeeded={fetchOnAuth}
      goToHome={() => history.push('/')}
      authorizing={authorizing}
      error={error}
    />
  ) : (
    <Login
      email={email}
      password={password}
      setState={setState}
      displayBadge={displayBadge}
      addUser={addUserFromToken}
      fetchNeeded={fetchOnAuth}
      goToHome={() => history.push('/')}
      authorizing={authorizing}
      error={error}
    />
  );
};

AuthPage.propTypes = {
  addUserFromToken: func.isRequired,
  fetchFiles: func.isRequired,
  fetchSentFiles: func.isRequired,
  fetchFriends: func.isRequired,
  fetchFriendRequests: func.isRequired,
  addStorageFiles: func.isRequired,
  history: object.isRequired // eslint-disable-line
};

export default connect(
  null,
  mapDispatchToProps
)(AuthPage);
