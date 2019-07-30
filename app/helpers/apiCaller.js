const callApi = (endpoint, body, method = 'GET') => {
  const token = localStorage.getItem('tempoToken') || null;
  const apiUrl = getApiUrl();

  return fetch(`${apiUrl}/api/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
};

export const uploadFile = (
  file,
  signedRequest,
  progressCb,
  finishCb,
  errorCb
) => {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', () => finishCb(file));
  oReq.upload.addEventListener(
    'progress',
    ({ loaded, total, lengthComputable }) => {
      if (lengthComputable) progressCb(file.id, loaded / total);
    }
  );
  oReq.addEventListener('error', e => errorCb(e));
  oReq.open('PUT', signedRequest);
  oReq.send(file);
};

export const getApiUrl = () =>
  process.env.NODE_ENV === 'production'
    ? 'https://tempo-share-web.herokuapp.com'
    : 'http://localhost:8080';

export default callApi;
