import React from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileShape } from '../shapes';
import styles from './Home.scss';

import FileList from './FileList';
import Loader from './Loader';

const Home = ({
  files,
  userId,
  isFetching,
  downloadFile,
  awaitSendForFiles,
  removeFile
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
    </div>
  );
};

Home.propTypes = {
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  downloadFile: func.isRequired,
  awaitSendForFiles: func.isRequired,
  removeFile: func.isRequired
};

export default Home;
