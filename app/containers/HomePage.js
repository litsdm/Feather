import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileType } from '../propTypes';

import Home from '../components/Home';

import { addFile, finishUpload, updateProgress } from '../actions/file';

const mapStateToProps = ({ file: { isUploading, files, isFetching }, user }) => (
  {
    isUploading,
    files,
    userId: user.id,
    isFetching
  }
);

const mapDispatchToProps = dispatch => ({
  hUpdateProgress: progress => dispatch(updateProgress(progress)),
  hAddFile: (file, upload) => dispatch(addFile(file, upload)),
  hFinishUpload: () => dispatch(finishUpload())
});

const HomePage = ({ isUploading, hAddFile, hFinishUpload, hUpdateProgress, files, userId, isFetching }) =>
  <Home
    isUploading={isUploading}
    addFile={hAddFile}
    finishUpload={hFinishUpload}
    updateProgress={hUpdateProgress}
    files={files}
    userId={userId}
    isFetching={isFetching}
  />

HomePage.propTypes = {
  isUploading: bool.isRequired,
  hAddFile: func.isRequired,
  hFinishUpload: func.isRequired,
  hUpdateProgress: func.isRequired,
  files: arrayOf(fileType).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
