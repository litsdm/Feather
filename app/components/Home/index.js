import React, { useState } from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { fileShape } from '../../shapes';
import styles from './styles.scss';

import FileList from './FileList';
import Queue from '../Queue';
import Loader from '../Loader';

const Home = ({
  files,
  userId,
  isFetching,
  downloadFile,
  awaitSendForFiles,
  removeFile,
  removeSentFile,
  queueFiles,
  completedCount,
  dlFiles,
  removeDlPath,
  sentFiles
}) => {
  const [section, setSection] = useState(0);
  const [displayMenu, setDisplayMenu] = useState(false);

  const handleFileChange = ({ target: { files: selectedFiles } }) => {
    awaitSendForFiles(selectedFiles);
  };

  const selectSection = index => () => {
    setDisplayMenu(false);
    setSection(index);
  };

  const toggleMenu = () => setDisplayMenu(!displayMenu);

  return (
    <div className={styles.container}>
      <div className={styles.topText}>
        <div style={styles.menuDropdown}>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={toggleMenu}
          >
            {section === 0 ? 'Your Files' : 'Sent Files'}{' '}
            <i
              className={`${
                displayMenu ? styles.iconRot : ''
              } fa fa-angle-down`}
            />
          </button>
          {displayMenu ? (
            <div className={styles.menu}>
              <button
                type="button"
                onClick={selectSection(0)}
                className={styles.menuButton}
                style={{ paddingRight: section === 0 ? '18px' : '31px' }}
              >
                Your Files{' '}
                {section === 0 ? <i className="fas fa-check" /> : null}
              </button>
              <button
                type="button"
                onClick={selectSection(1)}
                className={styles.menuButton}
                style={{ paddingRight: section === 1 ? '18px' : '31px' }}
              >
                Sent Files{' '}
                {section === 1 ? <i className="fas fa-check" /> : null}
              </button>
            </div>
          ) : null}
        </div>
        <label htmlFor="homeInput" className={styles.fileLabel}>
          <span>Select a file</span> or drop it anywhere.
          <input
            id="homeInput"
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <FileList
          files={section === 0 ? files : sentFiles}
          downloadFile={downloadFile}
          removeFile={removeFile}
          removeSentFile={removeSentFile}
          userId={userId}
          dlFiles={dlFiles}
          removeDlPath={removeDlPath}
          sent={section === 1}
        />
      )}
      <Queue files={queueFiles} completedCount={completedCount} />
    </div>
  );
};

Home.propTypes = {
  files: arrayOf(fileShape).isRequired,
  sentFiles: arrayOf(fileShape),
  userId: string.isRequired,
  isFetching: bool.isRequired,
  downloadFile: func.isRequired,
  awaitSendForFiles: func.isRequired,
  removeFile: func.isRequired,
  removeSentFile: func.isRequired,
  completedCount: number,
  dlFiles: shape({ fileID: string }),
  removeDlPath: func.isRequired,
  queueFiles: object.isRequired // eslint-disable-line react/forbid-prop-types
};

Home.defaultProps = {
  sentFiles: [],
  completedCount: 0,
  dlFiles: {}
};

export default Home;
