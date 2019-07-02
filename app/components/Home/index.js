import React from 'react';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
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
  queueFiles,
  completedCount
}) => {
  const handleFileChange = ({ target: { files: selectedFiles } }) => {
    awaitSendForFiles(selectedFiles);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topText}>
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
          files={files}
          downloadFile={downloadFile}
          removeFile={removeFile}
          userId={userId}
        />
      )}
      <Queue files={queueFiles} completedCount={completedCount} />
    </div>
  );
};

Home.propTypes = {
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  downloadFile: func.isRequired,
  awaitSendForFiles: func.isRequired,
  removeFile: func.isRequired,
  completedCount: number,
  queueFiles: object.isRequired // eslint-disable-line react/forbid-prop-types
};

Home.defaultProps = {
  completedCount: 0
};

export default Home;
