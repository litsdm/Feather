import React from 'react';
import { func, string } from 'prop-types';
import styles from './Auth.scss';

const Signup = ({ email, password, confirmPassword, setState }) => {
  const switchPage = () => setState('isNew', false);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  return (
    <div className={styles.container}>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input type="text" id="emailInput" value={email} onChange={handleChange} name="email"/>
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input type="password" id="passwordInput" value={password} onChange={handleChange} name="password"/>
      </label>
      <label className={styles.inputLabel} htmlFor="confirmInput">
        Confirm Password
        <input type="password" id="confirmInput" value={confirmPassword} onChange={handleChange} name="confirmPassword"/>
      </label>
      <button type="button" className={styles.primaryButton}>
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
  confirmPassword: string.isRequired,
  setState: func.isRequired
}

export default Signup;
