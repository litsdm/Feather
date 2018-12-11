import React from 'react';
import { func, string, bool } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../helpers/apiCaller';

import Loader from './Loader';

const Signup = ({
  email,
  password,
  username,
  setState,
  displayBanner,
  addUser,
  goToHome,
  fetchNeeded,
  authorizing
}) => {
  const switchPage = () => setState('isNew', false);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  const handleKeyPress = ({ key }) => {
    if (key === 'Enter') submit();
  };

  const validateEmail = emailStr => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailStr).toLowerCase());
  };

  const submit = () => {
    let errorMessage = '';

    const payload = {
      email,
      password,
      username
    };

    if (!validateEmail(email)) errorMessage = 'Email is invalid.';
    if (password.length < 3)
      errorMessage = 'Password must be at least 3 characters long.';

    if (errorMessage) {
      displayBanner('error', errorMessage);
      return;
    }

    setState('authorizing', true);

    callApi('sign-up', payload, 'POST')
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
      <img
        src="https://s3-us-west-1.amazonaws.com/tempo-tray-bucket/Feather.png"
        alt="feather logo"
        className={styles.img}
      />
      <label className={styles.inputLabel} htmlFor="usernameInput">
        Username
        <input
          type="text"
          id="usernameInput"
          value={username}
          onChange={handleChange}
          name="username"
          onKeyPress={handleKeyPress}
        />
      </label>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input
          type="email"
          id="emailInput"
          value={email}
          onChange={handleChange}
          name="email"
          onKeyPress={handleKeyPress}
        />
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input
          type="password"
          id="passwordInput"
          value={password}
          onChange={handleChange}
          name="password"
          onKeyPress={handleKeyPress}
        />
      </label>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={submit}
        disabled={authorizing}
      >
        {authorizing ? <Loader small /> : 'Signup'}
      </button>
      <span>
        Already have an account?{' '}
        <button type="button" className={styles.switch} onClick={switchPage}>
          Login
        </button>
      </span>
    </div>
  );
};

Signup.propTypes = {
  email: string.isRequired,
  password: string.isRequired,
  username: string.isRequired,
  setState: func.isRequired,
  displayBanner: func.isRequired,
  addUser: func.isRequired,
  fetchNeeded: func.isRequired,
  goToHome: func.isRequired,
  authorizing: bool.isRequired
};

export default Signup;
