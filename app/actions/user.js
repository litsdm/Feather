export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';

export const addUser = (user) => (
  {
    type: ADD_USER,
    user
  }
);

export const removeUser = () => (
  {
    type: REMOVE_USER
  }
);
