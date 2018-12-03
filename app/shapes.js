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
  email: string,
  password: string,
  username: string
});
