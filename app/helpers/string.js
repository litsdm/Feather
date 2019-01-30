/* eslint-disable import/prefer-default-export */
export const initials = name => {
  const nameSplit = name.split(' ');
  if (nameSplit.length >= 2)
    return `${nameSplit[0].charAt(0)}${nameSplit[1].charAt(0)}`.toUpperCase();
  return nameSplit[0].charAt(0).toUpperCase();
};

export const validateEmail = emailStr => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailStr).toLowerCase());
};
