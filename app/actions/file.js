// @flow
export const ADD_FILE = 'ADD_FILE';
export const FINISH_UPLOAD = 'FINISH_UPLOAD';

export function addFile(file, upload) {
  return {
    file,
    upload,
    type: ADD_FILE
  };
}

export function finishUpload() {
  return {
    type: FINISH_UPLOAD
  };
}

/* export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
} */
