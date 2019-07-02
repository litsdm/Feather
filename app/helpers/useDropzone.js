import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  useRef
} from 'react';
import { connect } from 'react-redux';

import { awaitRecipients } from '../actions/queue';

const mapDispatchToProps = dispatch => ({
  waitForRecipients: files => dispatch(awaitRecipients(files))
});

const DropzoneContext = createContext(undefined);

function _DropzoneProvider({ children, waitForRecipients }) {
  const [isDragging, setDragging] = useState(false);

  const value = useMemo(() => ({ isDragging }), [isDragging]);
  const cachedTarget = useRef(null);

  useEffect(() => {
    const handleDragEnter = ({ target }) => {
      cachedTarget.current = target;
    };

    const handleDragOver = e => {
      e.preventDefault();
      if (!isDragging) setDragging(true);
    };

    const handleDragLeave = ({ target }) => {
      if (target === cachedTarget.current && isDragging) setDragging(false);
    };

    const handleDrop = ({ dataTransfer: { files } }) => {
      if (isDragging) setDragging(false);
      waitForRecipients(files);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isDragging]);

  return (
    <DropzoneContext.Provider value={value}>
      {children}
    </DropzoneContext.Provider>
  );
}

export const DropzoneProvider = connect(
  null,
  mapDispatchToProps
)(_DropzoneProvider);

export default function useDropzone() {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error(`useDropzone must be used within a DropzoneProvider`);
  }

  return context.isDragging;
}
