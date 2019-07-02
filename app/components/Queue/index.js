import React, { Fragment, useState } from 'react';
import uuid from 'uuid/v4';
import { object, number } from 'prop-types';
import styles from './styles.scss';

import expandIcon from '../../assets/expand-icon.svg';
import shrinkIcon from '../../assets/shrink-icon.svg';

import Row from './row';

const Queue = ({ files, completedCount }) => {
  const [isExpanded, setExpanded] = useState(false);
  const fileKeys = Object.keys(files);

  const calculateTotalProgress = () => {
    // iterate through queued files and sum the progress
    let totalProgress = 0;
    const fileValues = Object.values(files);

    if (!fileValues || fileValues.length <= 0) return 0;

    fileValues.forEach(({ progress }) => {
      totalProgress += progress;
    });

    return Math.round((totalProgress / fileValues.length) * 100);
  };

  const hideOnExpand = () => (isExpanded ? { display: 'none' } : {});
  const showOnExpand = () => (!isExpanded ? { display: 'none' } : {});

  const withExpand = className =>
    `${className} ${isExpanded ? styles.expand : {}}`;

  const renderRows = () =>
    Object.values(files).map(({ name, progress }, index) => (
      <Fragment key={uuid()}>
        <Row name={name} progress={Math.round(progress * 100)} />
        {index + 1 < fileKeys.length ? (
          <div className={styles.divider} />
        ) : null}
      </Fragment>
    ));

  const totalProgress = calculateTotalProgress();

  return (
    <div style={{ display: fileKeys <= 0 ? 'none' : 'block' }}>
      <button
        type="button"
        className={styles.overlay}
        style={showOnExpand()}
        onClick={() => setExpanded(false)}
      />
      <div
        className={withExpand(styles.queue)}
        style={{ bottom: fileKeys.length <= 0 ? -80 : 0 }}
      >
        <div className={withExpand(styles.header)}>
          <div className={styles.info}>
            <p className={withExpand(styles.title)}>
              Uploading {fileKeys.length} files
            </p>
            <p className={styles.subtitle} style={hideOnExpand()}>
              {totalProgress}% • {completedCount} out of {fileKeys.length}{' '}
              completed
            </p>
          </div>
          <button
            type="button"
            className={withExpand(styles.expandButton)}
            onClick={() => setExpanded(!isExpanded)}
          >
            <img
              src={isExpanded ? shrinkIcon : expandIcon}
              alt="shrink or expand queue"
            />
          </button>
          <div
            className={styles.fullProgress}
            style={{ width: `${totalProgress}%`, ...hideOnExpand() }}
          >
            <div className={styles.line} />
          </div>
        </div>
        <div className={styles.divider} style={showOnExpand()} />
        {isExpanded ? <div className={styles.list}>{renderRows()}</div> : null}
      </div>
    </div>
  );
};

Queue.propTypes = {
  completedCount: number,
  files: object // eslint-disable-line react/forbid-prop-types
};

Queue.defaultProps = {
  completedCount: 0,
  files: {}
};

export default Queue;
