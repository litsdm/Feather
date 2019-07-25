import React from 'react';
import uuid from 'uuid/v4';
import { arrayOf, func, shape, string } from 'prop-types';
import styles from './filesModal.scss';

import { getFileIcon } from '../../helpers/file';

const FilesModal = ({ _id, files, close }) => {
  const renderFiles = () =>
    files.map(({ name }) => {
      const { color, icon } = getFileIcon(name);
      return (
        <div key={uuid()} className={styles.row}>
          <div className={styles.square}>
            <div
              className={styles.innerSquare}
              style={{ backgroundColor: color }}
            />
            <i className={icon} style={{ color }} />
          </div>
          <p className={styles.name}>{name}</p>
        </div>
      );
    });

  return (
    <div className={styles.filesModal}>
      <button type="button" className={styles.overlay} onClick={close} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <p className={styles.title}>Files for {_id}</p>
          <button type="button" className={styles.close} onClick={close}>
            <i className="fa fa-times" />
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.files}>{renderFiles()}</div>
      </div>
    </div>
  );
};

FilesModal.propTypes = {
  _id: string.isRequired,
  close: func.isRequired,
  files: arrayOf(
    shape({
      name: string,
      type: string
    })
  )
};

FilesModal.defaultProps = {
  files: []
};

export default FilesModal;
