import React from 'react';
import { func, string } from 'prop-types';
import styles from './Input.scss';

const Input = ({
  id,
  name,
  value,
  type,
  onChange,
  label,
  onKeyPress,
  error
}) => (
  <label
    htmlFor={id}
    className={styles.label}
    style={error ? { borderColor: '#FF5252' } : {}}
  >
    <p className={value ? styles.hasValue : ''}>
      {label}
      {error ? <b style={{ color: '#FF5252' }}>{` - ${error}`}</b> : null}
    </p>
    <input
      id={id}
      className={styles.input}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      onKeyPress={onKeyPress}
    />
  </label>
);

Input.propTypes = {
  id: string.isRequired,
  name: string,
  value: string,
  type: string,
  label: string,
  error: string,
  onChange: func,
  onKeyPress: func
};

Input.defaultProps = {
  name: '',
  value: '',
  type: 'text',
  label: 'string',
  error: '',
  onChange: () => {},
  onKeyPress: () => {}
};

export default Input;
