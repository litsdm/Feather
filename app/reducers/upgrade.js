import { DISPLAY_UPGRADE, HIDE_UPGRADE } from '../actions/upgrade';

const initialState = {
  visible: false,
  messageType: 'fileSize'
};

const upgrade = (state = initialState, { type, messageType }) => {
  switch (type) {
    case DISPLAY_UPGRADE:
      return {
        ...state,
        visible: true,
        messageType
      };
    case HIDE_UPGRADE:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
};

export default upgrade;
