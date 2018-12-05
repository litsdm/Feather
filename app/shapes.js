import { func, number, shape, string } from 'prop-types';

export const fileShape = shape({
  _id: string,
  name: string,
  s3Url: string,
  sender: string,
  size: number
});

export const historyShape = shape({
  push: func
});

export const userShape = shape({
  _id: string,
  email: string,
  password: string,
  username: string,
  placeholderColor: string
});

export const friendRequestShape = shape({
  createdAt: string,
  updatedAt: string,
  from: userShape,
  to: string
});
