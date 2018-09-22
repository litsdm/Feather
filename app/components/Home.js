import React from 'react';
import { arrayOf, bool, func, number, string, object } from 'prop-types';
import { fileType } from '../propTypes';
import styles from './Home.scss';

import DragBox from './DragBox';
import FileList from './FileList';
import Loader from './Loader';

const Home = ({
  isUploading,
  addFile,
  updateProgress,
  finishUpload,
  files,
  userId,
  isFetching,
  downloadFile,
  downloads,
  uploadId,
  uploadProgress
}) => (
  <div className={styles.container}>
    <DragBox
      isUploading={isUploading}
      addFile={addFile}
      updateProgress={updateProgress}
      finishUpload={finishUpload}
      userId={userId}
    />
    {
      isFetching
        ? <Loader />
        : <FileList
          files={files}
          downloadFile={downloadFile}
          downloads={downloads}
          uploadId={uploadId}
          uploadProgress={uploadProgress}
        />
    }
  </div>
);

Home.propTypes = {
  isUploading: bool.isRequired,
  addFile: func.isRequired,
  finishUpload: func.isRequired,
  updateProgress: func.isRequired,
  files: arrayOf(fileType).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  downloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  uploadId: string.isRequired,
  uploadProgress: number.isRequired
};

export default Home;
