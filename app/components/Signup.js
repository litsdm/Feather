import React from 'react';
import { func, string } from 'prop-types';
import styles from './Auth.scss';

const Signup = ({ email, password, username, setState, displayBanner }) => {
  const switchPage = () => setState('isNew', false);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

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
      <button type="button" className={styles.primaryButton} onClick={() => displayBanner('success', 'Email already exists.')}>
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
  displayBanner: func.isRequired
}

export default Signup;
