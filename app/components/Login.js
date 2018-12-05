import React from 'react';
import { func, string, bool } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../helpers/apiCaller';

import Loader from './Loader';

const Login = ({
  email,
  password,
  setState,
  displayBanner,
  addUser,
  goToHome,
  fetchNeeded,
  authorizing
}) => {
  const switchPage = () => setState('isNew', true);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  const handleKeyPress = ({ key }) => {
    if (key === 'Enter') login();
  };

  const login = () => {
    const payload = {
      email,
      password
    };
    let errorMessage = '';

    if (email === '') errorMessage = 'Please enter your email.';
    else if (password === '') errorMessage = 'Please enter your password.';

    if (errorMessage) {
      displayBanner('error', errorMessage);
      return;
    }

    setState('authorizing', true);

    callApi('login', payload, 'POST')
      .then(res => res.json())
      .then(({ token, message }) => {
        if (message) return Promise.reject(message);

        localStorage.setItem('tempoToken', token);
        addUser(token);
        fetchNeeded();
        goToHome();
        return token;
      })
      .catch(err => {
        const message = typeof err === 'string' ? err : err.message;
        setState('authorizing', false);
        displayBanner('error', message);
      });
  };

  return (
    <div className={styles.container}>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input
          name="email"
          type="email"
          id="emailInput"
          value={email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input
          name="password"
          type="password"
          id="passwordInput"
          value={password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </label>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={login}
        disabled={authorizing}
      >
        {authorizing ? <Loader small /> : 'Login'}
      </button>
      <span>
        New to Tempo?{' '}
        <button type="button" className={styles.switch} onClick={switchPage}>
          Signup
        </button>
      </span>
    </div>
  );
};

Login.propTypes = {
  email: string.isRequired,
  password: string.isRequired,
  setState: func.isRequired,
  displayBanner: func.isRequired,
  addUser: func.isRequired,
  fetchNeeded: func.isRequired,
  goToHome: func.isRequired,
  authorizing: bool.isRequired
};

export default Login;
