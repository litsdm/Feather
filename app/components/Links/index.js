import React, { useState, Fragment } from 'react';
import moment from 'moment';
import { writeText } from 'clipboard-polyfill';
import uuid from 'uuid/v4';
import { arrayOf, func } from 'prop-types';
import { linkShape } from '../../shapes';
import styles from './styles.scss';

import Row from './row';
import FilesModal from './filesModal';

const Links = ({ links, removeLink }) => {
  const [selectedIndex, setIndex] = useState(null);

  const copyText = url => {
    writeText(url);
    // display copied to clipboard badge
  };

  const selectLink = index => () => setIndex(index);

  const deleteLink = link => () => removeLink(link);

  const renderLinks = () =>
    links.map((link, index) => {
      const { _id, createdAt, expiresAt } = link;
      const dateString = moment(createdAt).format('MM/DD/YYYY');
      return (
        <Fragment key={uuid()}>
          <Row
            id={_id}
            date={dateString}
            expiresAt={expiresAt}
            copyText={copyText}
            select={selectLink(index)}
            deleteLink={deleteLink(link)}
          />
          {index !== links.length - 1 ? (
            <div className={styles.divider} />
          ) : null}
        </Fragment>
      );
    });

  return (
    <div className={styles.links}>
      {renderLinks()}
      {selectedIndex !== null ? (
        <FilesModal {...links[selectedIndex]} close={selectLink(null)} />
      ) : null}
    </div>
  );
};

Links.propTypes = {
  links: arrayOf(linkShape),
  removeLink: func.isRequired
};

Links.defaultProps = {
  links: []
};

export default Links;
