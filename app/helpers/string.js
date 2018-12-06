/* eslint-disable import/prefer-default-export */
export const initials = name => {
  const nameSplit = name.split(' ');
  if (nameSplit.length >= 2)
    return `${nameSplit[0].charAt(0)}${nameSplit[1].charAt(0)}`.toUpperCase();
  return nameSplit[0].charAt(0).toUpperCase();
};
