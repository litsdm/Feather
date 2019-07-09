import React from 'react';
import { func, string } from 'prop-types';
import styles from './Input.scss';

const Input = ({
  id,
  value,
  onChange,
  type,
  placeholder,
  icon,
  onKeyPress,
  name
}) => (
  <label htmlFor={id} className={styles.label}>
    <p className={value ? styles.hasValue : ''}>{placeholder}</p>
    <input
      id={id}
      name={name}
      className={styles.input}
      onChange={onChange}
      value={value}
      type={type}
      onKeyPress={onKeyPress}
    />
    <i className={`${styles.icon} ${icon}`} />
  </label>
);

Input.propTypes = {
  id: string.isRequired,
  value: string,
  onChange: func,
  icon: string,
  type: string,
  placeholder: string,
  onKeyPress: func,
  name: string
};

Input.defaultProps = {
  value: '',
  onChange: () => {},
  onKeyPress: () => {},
  icon: 'fa fa-envelope',
  type: 'text',
  placeholder: '',
  name: ''
};

export default Input;
