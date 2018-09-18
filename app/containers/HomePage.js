import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileType } from '../propTypes';

import Home from '../components/Home';

import { addFile, finishUpload, updateProgress } from '../actions/file';

const mapStateToProps = ({ file: { isUploading, files }, user }) => (
  {
    isUploading,
    files,
    userId: user.id
  }
);

const mapDispatchToProps = dispatch => ({
  hUpdateProgress: progress => dispatch(updateProgress(progress)),
  hAddFile: (file, upload) => dispatch(addFile(file, upload)),
  hFinishUpload: () => dispatch(finishUpload())
});

const HomePage = ({ isUploading, hAddFile, hFinishUpload, hUpdateProgress, files, userId }) =>
  <Home
    isUploading={isUploading}
    addFile={hAddFile}
    finishUpload={hFinishUpload}
    updateProgress={hUpdateProgress}
    files={files}
    userId={userId}
  />

HomePage.propTypes = {
  isUploading: bool.isRequired,
  hAddFile: func.isRequired,
  hFinishUpload: func.isRequired,
  hUpdateProgress: func.isRequired,
  files: arrayOf(fileType).isRequired,
  userId: string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
