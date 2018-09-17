import React from 'react';
import { arrayOf, string } from 'prop-types';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = ({ files }) => {
  const renderFiles = () =>
    files.map((name, size, createdAt) => <FileRow fileName={name} size={size} date={createdAt} />);

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Your Files
      </p>
      <div className={styles.list}>
        {
          files.length > 0
            ? renderFiles()
            : (
              <div className={styles.empty}>
                You have no files yet. Drag any file above to upload it.
              </div>
            )
        }
      </div>
    </div>
  );
};

FileList.propTypes = {
  files: arrayOf(string).isRequired
};

export default FileList;
