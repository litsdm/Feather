import React from 'react';
import { func, string } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../helpers/apiCaller';

const Signup = ({ email, password, username, setState, displayBanner, addUser, goToHome }) => {
  const switchPage = () => setState('isNew', false);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  const validateEmail = (emailStr) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailStr).toLowerCase());
  }

  const submit = () => {
    let errorMessage = '';

    const payload = {
      email,
      password,
      username
    }

    if (!validateEmail(email)) errorMessage = 'Email is invalid.';
    if (password.length < 3) errorMessage = 'Password must be at least 3 characters long.';

    if (errorMessage) {
      displayBanner('error', errorMessage);
      return;
    }

    callApi('sign-up', payload, 'POST')
      .then(res => res.json())
      .then(({ token, message }) => {
        if (message) return Promise.reject(message);

        localStorage.setItem('token', token);
        addUser(token);
        goToHome();
        return token;
      })
      .catch(err => displayBanner('error', err));
  }

  return (
    <div className={styles.container}>
      <label className={styles.inputLabel} htmlFor="usernameInput">
        Username
        <input type="text" id="usernameInput" value={username} onChange={handleChange} name="username"/>
      </label>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input type="email" id="emailInput" value={email} onChange={handleChange} name="email"/>
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input type="password" id="passwordInput" value={password} onChange={handleChange} name="password"/>
      </label>
      <button type="button" className={styles.primaryButton} onClick={submit}>
        Signup
      </button>
      <span>
        Already have an account? <button type="button" className={styles.switch} onClick={switchPage}>Login</button>
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
  goToHome: func.isRequired
}

export default Signup;
