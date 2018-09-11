import React, { Component } from 'react';

import Login from '../components/Login';
import Signup from '../components/Signup';

class AuthPage extends Component {
  state = {
    confirmPassword: '',
    email: '',
    isNew: false,
    password: ''
  };

  setStateProperty = (property, value) => this.setState({ [property]: value });

  render() {
    const { confirmPassword, email, isNew, password } = this.state;
    return isNew
      ? <Signup
        confirmPassword={confirmPassword}
        email={email}
        password={password}
        setState={this.setStateProperty}
      />
      : <Login
        email={email}
        password={password}
        setState={this.setStateProperty}
      />;
  }
}

export default AuthPage;
