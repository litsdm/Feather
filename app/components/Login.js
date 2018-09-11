import React from 'react';
import { func, string } from 'prop-types';
import styles from './Auth.scss';

const Login = ({ email, password, setState }) => {
  const switchPage = () => setState('isNew', true);

  const handleChange = ({ target: { name, value } }) => setState(name, value);

  return (
    <div className={styles.container}>
      <label className={styles.inputLabel} htmlFor="emailInput">
        Email
        <input name="email" type="text" id="emailInput" value={email} onChange={handleChange} />
      </label>
      <label className={styles.inputLabel} htmlFor="passwordInput">
        Password
        <input name="password" type="password" id="passwordInput" value={password} onChange={handleChange} />
      </label>
      <button type="button" className={styles.primaryButton}>
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
  setState: func.isRequired
};

export default Login;
