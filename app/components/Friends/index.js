import React from 'react';
import styles from './styles.scss';
import rowStyles from './FriendRow.scss';

import FriendRow from './FriendRow';

const Friends = () => (
  <div className={styles.friends}>
    <div className={styles.searchWrapper}>
      <label htmlFor="searchInput" className={styles.searchLabel}>
        <i className="fa fa-search" />
        <input
          id="searchInput"
          name="search"
          type="text"
          placeholder="Search for friends"
        />
      </label>
    </div>
    <div className={styles.list}>
      <button type="button" className={rowStyles.row}>
        <div className={styles.addIcon}>
          <i className="fa fa-user-plus" />
        </div>
        <p className={styles.addText}>Add Friend</p>
      </button>
      <FriendRow
        _id="43534598792834"
        name="Juan Pablo"
        placeholderColor="#4CAF50"
      />
      <FriendRow
        _id="55897692023940"
        name="Kenny Lugo"
        placeholderColor="#03A9F4"
      />
    </div>
  </div>
);

export default Friends;
