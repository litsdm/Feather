import React from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileType } from '../propTypes';
import styles from './Home.scss';

import DragBox from './DragBox';
import FileList from './FileList';

const Home = ({ isUploading, addFile, updateProgress, finishUpload, files, userId }) => (
  <div className={styles.container}>
    <DragBox
      isUploading={isUploading}
      addFile={addFile}
      updateProgress={updateProgress}
      finishUpload={finishUpload}
      userId={userId}
    />
    <FileList files={files} />
  </div>
);

Home.propTypes = {
  isUploading: bool.isRequired,
  addFile: func.isRequired,
  finishUpload: func.isRequired,
  updateProgress: func.isRequired,
  files: arrayOf(fileType).isRequired,
  userId: string.isRequired
};

export default Home;
