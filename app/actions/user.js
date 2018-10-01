export const ADD_USER = 'ADD_USER';
export const USER_LOGOUT = 'USER_LOGOUT';

export const addUser = (user) => (
  {
    type: ADD_USER,
    user
  }
);

export const logoutUser = () => (
  {
    type: USER_LOGOUT
  }
)
