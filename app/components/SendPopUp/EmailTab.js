import React from 'react';
import { arrayOf, func, string } from 'prop-types';
import styles from './EmailTab.scss';

import Input from './Input';

const EmailTab = ({
  currentEmail,
  emails,
  handleChange,
  removeEmail,
  handleKeyPress,
  error
}) => {
  const renderEmailTags = () =>
    emails.map((email, index) => (
      <div className={styles.tag}>
        {email}
        <button type="button" onClick={() => removeEmail(index)}>
          <i className="fa fa-times" />
        </button>
      </div>
    ));

  return (
    <div className={styles.emailTab}>
      <p className={styles.note}>
        You can now send files to anyone using Feather! Just type their email(s)
        below and click that send button.
      </p>
      <Input
        id="emailInput"
        label="Email"
        name="currentEmail"
        value={currentEmail}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        error={error}
      />
      <div className={styles.tags}>{renderEmailTags()}</div>
    </div>
  );
};

EmailTab.propTypes = {
  currentEmail: string.isRequired,
  emails: arrayOf(string),
  handleChange: func.isRequired,
  removeEmail: func.isRequired,
  handleKeyPress: func.isRequired,
  error: string
};

EmailTab.defaultProps = {
  emails: [],
  error: ''
};

export default EmailTab;
