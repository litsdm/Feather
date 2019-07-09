import React from 'react';
import { func, string, bool } from 'prop-types';
import styles from './Auth.scss';

import callApi from '../../helpers/apiCaller';
import analytics from '../../helpers/analytics';

import Loader from '../Loader';
import Input from './Input';
import Badge from './Badge';

const Signup = ({
  email,
  password,
  username,
  setState,
  displayBadge,
  addUser,
  goToHome,
  fetchNeeded,
  authorizing,
  error
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

  const callSignup = async () => {
    try {
      const payload = {
        email,
        password,
        username
      };

      const response = await callApi('sign-up', payload, 'POST');
      const { token, message } = await response.json();

      if (message) throw new Error(message);

      return token;
    } catch (exception) {
      throw new Error(exception.message);
    }
  };

  const validate = () => {
    let errorMessage = '';

    if (!validateEmail(email)) errorMessage = 'Email is invalid.';
    if (password.length < 3)
      errorMessage = 'Password must be at least 3 characters long.';

    return errorMessage;
  };

  const submit = async () => {
    try {
      const errorMessage = validate();
      if (errorMessage) {
        displayBadge(errorMessage);
        return;
      }

      setState('authorizing', true);

      const token = await callSignup();

      localStorage.setItem('tempoToken', token);
      addUser(token);
      fetchNeeded();
      goToHome();
      analytics.send('event', {
        ec: 'User-El',
        ea: 'signup',
        el: 'User signed up'
      });
    } catch (exception) {
      setState('authorizing', false);
      displayBadge(exception.message);
      console.error(`[Signup.submit] ${exception.message}`);
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
          type="text"
          id="usernameInput"
          placeholder="Username"
          icon="fas fa-user"
          value={username}
          onChange={handleChange}
          name="username"
          onKeyPress={handleKeyPress}
        />
        <Input
          type="email"
          id="emailInput"
          placeholder="Email"
          icon="fa fa-envelope"
          value={email}
          onChange={handleChange}
          name="email"
          onKeyPress={handleKeyPress}
        />
        <Input
          type="password"
          id="passwordInput"
          placeholder="Password"
          icon="fa fa-key"
          value={password}
          onChange={handleChange}
          name="password"
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={styles.footer}>
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
    </div>
  );
};

Signup.propTypes = {
  email: string.isRequired,
  password: string.isRequired,
  username: string.isRequired,
  setState: func.isRequired,
  displayBadge: func.isRequired,
  addUser: func.isRequired,
  fetchNeeded: func.isRequired,
  goToHome: func.isRequired,
  authorizing: bool.isRequired,
  error: string
};

Signup.defaultProps = {
  error: null
};

export default Signup;
