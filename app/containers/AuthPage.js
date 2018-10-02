import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import jwtDecode from 'jwt-decode';

import { emit } from '../socketClient';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Banner from '../components/Banner';

import { addUser } from '../actions/user';
import { fetchFilesIfNeeded } from '../actions/file';

const mapDispatchToProps = dispatch => ({
  addUserFromToken: token => {
    const user = jwtDecode(token);
    emit('connectUser', user.id);
    dispatch(addUser(user));
  },
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
});

class AuthPage extends Component {
  state = {
    bannerMessage: null,
    username: '',
    email: '',
    isNew: false,
    password: ''
  };

  setStateProperty = (property, value) => this.setState({ [property]: value });

  displayBanner = (type, message) => this.setState({ bannerMessage: { type, text: message } });

  setHide = () => this.setState({ bannerMessage: null });

  render() {
    const { username, email, isNew, password, bannerMessage } = this.state;
    const { addUserFromToken, fetchFiles, history } = this.props;
    return (
      <Fragment>
        <Banner message={bannerMessage} setHide={this.setHide} time={5000} />
        {
          isNew
            ? <Signup
              username={username}
              email={email}
              password={password}
              setState={this.setStateProperty}
              displayBanner={this.displayBanner}
              addUser={addUserFromToken}
              fetchFiles={fetchFiles}
              goToHome={() => history.push('/')}
            />
            : <Login
              email={email}
              password={password}
              setState={this.setStateProperty}
              displayBanner={this.displayBanner}
              addUser={addUserFromToken}
              fetchFiles={fetchFiles}
              goToHome={() => history.push('/')}
            />
        }
      </Fragment>
    );
  }
}

AuthPage.propTypes = {
  addUserFromToken: func.isRequired,
  fetchFiles: func.isRequired,
  history: object.isRequired // eslint-disable-line
};

export default connect(null, mapDispatchToProps)(AuthPage);
