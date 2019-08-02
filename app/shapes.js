import {
  arrayOf,
  func,
  number,
  node,
  oneOfType,
  shape,
  string
} from 'prop-types';

export const linkShape = shape({
  _id: string,
  s3Url: string,
  name: string,
  s3Filename: string,
  files: arrayOf(
    shape({
      name: string,
      type: string
    })
  )
});

export const fileShape = shape({
  _id: string,
  name: string,
  s3Url: string,
  from: string,
  size: number,
  to: arrayOf(string)
});

export const historyShape = shape({
  push: func
});

export const userShape = shape({
  _id: string,
  email: string,
  password: string,
  username: string,
  placeholderColor: string,
  profilePic: string
});

export const friendRequestShape = shape({
  createdAt: string,
  updatedAt: string,
  from: userShape,
  to: string
});

export const childrenShape = oneOfType([arrayOf(node), node]);
