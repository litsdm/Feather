import React from 'react';
import { func, string, bool } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../../helpers/apiCaller';
import analytics from '../../helpers/analytics';

import Loader from '../Loader';
import Input from './Input';
import Badge from './Badge';

const Login = ({
  email,
  password,
  setState,
  displayBadge,
  addUser,
  goToHome,
  fetchNeeded,
  authorizing,
  error
}) => {
  const switchPage = () => setState('isNew', true);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  const handleKeyPress = ({ key }) => {
    if (key === 'Enter') login();
  };

  const validate = () => {
    let errorMessage = '';

    if (email === '') errorMessage = 'Please enter your email.';
    else if (password === '') errorMessage = 'Please enter your password.';

    return errorMessage;
  };

  const callLogin = async () => {
    try {
      const payload = {
        email,
        password
      };

      const response = await callApi('login', payload, 'POST');
      const { token, message } = await response.json();

      if (message) throw new Error(message);

      return token;
    } catch (exception) {
      throw new Error(exception.message);
    }
  };

  const login = async () => {
    try {
      const errorMessage = validate();
      if (errorMessage) {
        displayBadge(errorMessage);
        return;
      }

      setState('authorizing', true);

      const token = await callLogin();

      localStorage.setItem('tempoToken', token);
      addUser(token);
      fetchNeeded();
      goToHome();
      analytics.send('event', {
        ec: 'User-El',
        ea: 'login',
        el: 'User logged in'
      });
    } catch (exception) {
      setState('authorizing', false);
      displayBadge(exception.message);
      console.error(`[Login.login] ${exception.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <Badge error={error} />
      <img
        src="https://s3-us-west-1.amazonaws.com/tempo-tray-bucket/Feather.png"
        alt="feather logo"
        className={styles.img}
      />
      <div className={styles.inputs}>
        <Input
          name="email"
          type="email"
          id="emailInput"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <Input
          name="password"
          type="password"
          id="passwordInput"
          placeholder="Password"
          icon="fa fa-key"
          value={password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={login}
          disabled={authorizing}
        >
          {authorizing ? <Loader small /> : 'Login'}
        </button>
        <span>
          New to Feather?{' '}
          <button type="button" className={styles.switch} onClick={switchPage}>
            Signup
          </button>
        </span>
      </div>
    </div>
  );
};

Login.propTypes = {
  email: string.isRequired,
  password: string.isRequired,
  setState: func.isRequired,
  displayBadge: func.isRequired,
  addUser: func.isRequired,
  fetchNeeded: func.isRequired,
  goToHome: func.isRequired,
  authorizing: bool.isRequired,
  error: string
};

Login.defaultProps = {
  error: null
};

export default Login;
