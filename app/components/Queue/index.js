import React, { useState } from 'react';
import styles from './styles.scss';

import expandIcon from '../../assets/expand-icon.svg';
import shrinkIcon from '../../assets/shrink-icon.svg';

import Row from './row';

const tempData = [
  {
    name: 'Movie trailer.mp4',
    progress: 0.344
  },
  {
    name: 'final_project.pdf',
    progress: 0.644
  },
  {
    name: 'eng-essay.docx',
    progress: 0.287
  },
  {
    name: 'final-animation6.aep',
    progress: 0.287
  },
  {
    name: 'final_project.pdf',
    progress: 0.644
  },
  {
    name: 'eng-essay.docx',
    progress: 0.287
  },
  {
    name: 'final-animation6.aep',
    progress: 0.287
  }
];

const Queue = () => {
  const [isExpanded, setExpanded] = useState(false);

  const calculateTotalProgress = () => {
    // iterate through queued files and sum the progress
    const progress = 0.54;

    return Math.round(progress * 100);
  };

  const hideOnExpand = () => (isExpanded ? { display: 'none' } : {});
  const showOnExpand = () => (!isExpanded ? { display: 'none' } : {});

  const withExpand = className =>
    `${className} ${isExpanded ? styles.expand : {}}`;

  const renderRows = () =>
    tempData.map(({ name, progress }, index) => (
      <>
        <Row name={name} progress={Math.round(progress * 100)} />
        {index + 1 < tempData.length ? (
          <div className={styles.divider} />
        ) : null}
      </>
    ));

  const totalProgress = calculateTotalProgress();

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.overlay}
        style={showOnExpand()}
        onClick={() => setExpanded(false)}
      />
      <div className={withExpand(styles.queue)}>
        <div className={withExpand(styles.header)}>
          <div className={styles.info}>
            <p className={withExpand(styles.title)}>Uploading 3 files</p>
            <p className={styles.subtitle} style={hideOnExpand()}>
              {totalProgress}% • 0 out of 3 completed
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

export default Queue;
