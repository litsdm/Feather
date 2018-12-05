import React from 'react';
import { bool, string } from 'prop-types';
import styles from './FileItem.scss';

import { getFileIcon } from '../../helpers/file';

const FileItem = ({ filename, isUploading }) => {
  const fileIcon = getFileIcon(filename);

  return (
    <div className={isUploading ? styles.uploading : styles.fileIcon}>
      <i className={fileIcon.icon} style={{ color: fileIcon.color }} />
    </div>
  );
};

FileItem.propTypes = {
  filename: string.isRequired,
  isUploading: bool
};

FileItem.defaultProps = {
  isUploading: false
};

export default FileItem;
