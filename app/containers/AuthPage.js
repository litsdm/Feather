import React, { useState } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import jwtDecode from 'jwt-decode';

import { emit } from '../socketClient';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

import { addUser } from '../actions/user';
import { fetchFilesIfNeeded } from '../actions/file';
import { fetchFriendsIfNeeded } from '../actions/friend';
import { fetchFriendRequestsIfNeeded } from '../actions/friendRequest';

const mapDispatchToProps = dispatch => ({
  addUserFromToken: token => {
    const user = jwtDecode(token);
    emit('userConnection', user.id);
    dispatch(addUser(user));
  },
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
  fetchFriends: () => dispatch(fetchFriendsIfNeeded()),
  fetchFriendRequests: () => dispatch(fetchFriendRequestsIfNeeded())
});

const AuthPage = ({
  fetchFiles,
  fetchFriends,
  fetchFriendRequests,
  addUserFromToken,
  history
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
    fetchFiles();
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
  fetchFriends: func.isRequired,
  fetchFriendRequests: func.isRequired,
  history: object.isRequired // eslint-disable-line
};

export default connect(
  null,
  mapDispatchToProps
)(AuthPage);
