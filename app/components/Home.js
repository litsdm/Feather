import React from 'react';
import { arrayOf, bool, func, number, string, object } from 'prop-types';
import { fileShape } from '../shapes';
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
  uploadProgress,
  removeFile,
  awaitSendForFiles,
  uploadToPersonal
}) => (
  <div className={styles.container}>
    <DragBox
      isUploading={isUploading}
      addFile={addFile}
      updateProgress={updateProgress}
      finishUpload={finishUpload}
      userId={userId}
      awaitSendForFiles={awaitSendForFiles}
    />
    {isFetching ? (
      <Loader />
    ) : (
      <FileList
        files={files}
        downloadFile={downloadFile}
        downloads={downloads}
        uploadId={uploadId}
        uploadProgress={uploadProgress}
        removeFile={removeFile}
        userId={userId}
        uploadToPersonal={uploadToPersonal}
      />
    )}
  </div>
);

Home.propTypes = {
  isUploading: bool.isRequired,
  addFile: func.isRequired,
  finishUpload: func.isRequired,
  updateProgress: func.isRequired,
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  downloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  uploadId: string.isRequired,
  uploadProgress: number.isRequired,
  removeFile: func.isRequired,
  awaitSendForFiles: func.isRequired,
  uploadToPersonal: func.isRequired
};

export default Home;
