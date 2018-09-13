import React, { Component, Fragment } from 'react';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Banner from '../components/Banner';

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
            />
            : <Login
              email={email}
              password={password}
              setState={this.setStateProperty}
              displayBanner={this.displayBanner}
            />
        }
      </Fragment>
    )
  }
}

export default AuthPage;
