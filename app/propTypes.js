import { func, number, shape, string } from 'prop-types';

export const fileType = shape({
  _id: string,
  name: string,
  s3Url: string,
  sender: string,
  size: number
});

export const history = shape({
  push: func
});
