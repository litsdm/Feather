const callApi = (endpoint, body, method = 'GET') => {
  const token = localStorage.getItem('tempoToken') || null;
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://tempo-web.herokuapp.com'
    : 'localhost:8080';
  const urlScheme = apiUrl === 'localhost:8080' ? 'http://' : '';

  return fetch(`${urlScheme}${apiUrl}/api/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
};

export default callApi;
