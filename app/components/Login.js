import React from 'react';
import { func, string } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../helpers/apiCaller';

const Login = ({ email, password, setState, displayBanner, addUser, goToHome }) => {
  const switchPage = () => setState('isNew', true);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

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

    callApi('login', payload, 'POST')
      .then(res => res.json())
      .then(({ token, message }) => {
        if (message) return Promise.reject(message);

        localStorage.setItem('tempoToken', token);
        addUser(token);
        goToHome();
        return token;
      })
      .catch(err => displayBanner('error', err));
  }

  return (
    <div className={styles.container}>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input name="email" type="email" id="emailInput" value={email} onChange={handleChange} />
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input name="password" type="password" id="passwordInput" value={password} onChange={handleChange} />
      </label>
      <button type="button" className={styles.primaryButton} onClick={login}>
        Login
      </button>
      <span>
        New to Tempo? <button type="button" className={styles.switch} onClick={switchPage}>Signup</button>
      </span>
    </div>
  );
}

Login.propTypes = {
  email: string.isRequired,
  password: string.isRequired,
  setState: func.isRequired,
  displayBanner: func.isRequired,
  addUser: func.isRequired,
  goToHome: func.isRequired
};

export default Login;
