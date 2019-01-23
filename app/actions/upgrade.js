import analytics from '../helpers/analytics';

export const DISPLAY_UPGRADE = 'DISPLAY_UPGRADE';
export const HIDE_UPGRADE = 'HIDE_UPGRADE';

export const displayUpgrade = messageType => {
  analytics.send('event', {
    ec: 'Upgrade-El',
    ea: 'display',
    el: 'Display upgrade modal'
  });
  return {
    type: DISPLAY_UPGRADE,
    messageType
  };
};

export const hideUpgrade = () => ({
  type: HIDE_UPGRADE
});
