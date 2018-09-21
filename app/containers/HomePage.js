import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string, object } from 'prop-types';
import { fileType } from '../propTypes';

import Home from '../components/Home';

import { addFile, finishUpload, updateProgress } from '../actions/file';
import { downloadFile } from '../actions/download';

const mapStateToProps = ({ file: { isUploading, files, isFetching }, user, downloads }) => (
  {
    isUploading,
    files,
    userId: user.id,
    isFetching,
    downloads
  }
);

const mapDispatchToProps = dispatch => ({
  hUpdateProgress: progress => dispatch(updateProgress(progress)),
  hAddFile: (file, upload) => dispatch(addFile(file, upload)),
  hFinishUpload: () => dispatch(finishUpload()),
  hDownloadFile: (fileId, url, filename, path = null) => dispatch(downloadFile(fileId, url, filename, path))
});

const HomePage = ({
  isUploading,
  hAddFile,
  hFinishUpload,
  hUpdateProgress,
  files,
  userId,
  isFetching,
  hDownloadFile,
  downloads
}) =>
  <Home
    isUploading={isUploading}
    addFile={hAddFile}
    finishUpload={hFinishUpload}
    updateProgress={hUpdateProgress}
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={hDownloadFile}
    downloads={downloads}
  />

HomePage.propTypes = {
  isUploading: bool.isRequired,
  hAddFile: func.isRequired,
  hFinishUpload: func.isRequired,
  hUpdateProgress: func.isRequired,
  files: arrayOf(fileType).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  hDownloadFile: func.isRequired,
  downloads: object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
