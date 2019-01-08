export const DISPLAY_UPGRADE = 'DISPLAY_UPGRADE';
export const HIDE_UPGRADE = 'HIDE_UPGRADE';

export const displayUpgrade = messageType => ({
  type: DISPLAY_UPGRADE,
  messageType
});

export const hideUpgrade = () => ({
  type: HIDE_UPGRADE
});
