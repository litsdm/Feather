import React, { Fragment } from 'react';
import uuid from 'uuid/v4';
import { arrayOf, bool, func, objectOf } from 'prop-types';
import { userShape } from '../../shapes';
import styles from './styles.scss';

import Row from './Row';
import ProfilePic from '../ProfilePic';

const FriendsTab = ({
  receivers,
  selectedIndeces,
  friends,
  handleAdd,
  handleRemove
}) => {
  const renderSelectedFriends = () => {
    const picStyle = {
      border: '1px solid #fff',
      height: '18px',
      marginLeft: '-3px',
      marginRight: 0,
      width: '18px'
    };

    return receivers.map(friend => (
      <ProfilePic
        key={uuid()}
        {...friend}
        picStyle={picStyle}
        phStyle={{ fontSize: '9px' }}
      />
    ));
  };

  const renderFriends = () =>
    friends.map((friend, index) => (
      <Row
        key={uuid()}
        isSelected={selectedIndeces[index] || false}
        addFriend={handleAdd}
        removeFriend={handleRemove}
        index={index}
        {...friend}
      />
    ));

  return (
    <Fragment>
      {receivers.length > 0 ? (
        <div className={styles.selectedFriends}>{renderSelectedFriends()}</div>
      ) : null}
      <div className={styles.list}>{renderFriends()}</div>
    </Fragment>
  );
};

FriendsTab.propTypes = {
  friends: arrayOf(userShape).isRequired,
  receivers: arrayOf(userShape).isRequired,
  selectedIndeces: objectOf(bool).isRequired,
  handleAdd: func.isRequired,
  handleRemove: func.isRequired
};

export default FriendsTab;
